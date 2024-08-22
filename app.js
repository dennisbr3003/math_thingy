const express = require('express')
const path = require('path') 

const PageData = require('./classes/PageData')
const Entity = require('./classes/Entity')
const ReqData = require('./classes/ReqData')

require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views') 
app.listen(process.env.PORT) 

const entity = new Entity(__dirname)
const pageData = new PageData(__dirname)
const reqData = new ReqData()

console.log('ready to receive requests on ', `http://localhost:${process.env.PORT}`)

app.use(express.static(path.join(__dirname, "public")));
// middleware to "get" form data to the "req" object of a app.post call, it will be reachable in reg.body
app.use(express.urlencoded({extended: true}))

app.use(require('./middlewares.js'))

app.get('/', async (req, res) => {
  res.redirect('/start')
})

// this is comming in from the math thingy app
app.get('/signin/:deviceId', async (req, res) => {
  if(req.params.deviceId!=='') {
    res.clearCookie("player") // reset cookie  
    const player = await entity.getPlayer(req.params.deviceId) // get player data with deviceId
    if(player!==null) res.cookie('player', reqData.getPlayerCookie(player), reqData.getPlayerCookieOptions(reqData.getCookiePermission(req.cookies)))
  }
  res.redirect('/start')
})

app.get('/start', async (req, res) => {
  res.render('index', await pageData.getPageData('index', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.get('/switch/:lng', async (req, res) => {
    const { lng } = req.params;
    res.cookie('i18next', lng)
    res.redirect('back'); // Redirect back to the previous page, this reloads the page the request came from
});

app.get('/about', async (req, res) => {
  res.render('about', await pageData.getPageData('about', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.get('/about/contact', async (req, res) => {
  res.render('contact', await pageData.getPageData('contact', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.post('/about/contact', async (req, res) => {
  
  req.body.deviceId = reqData.getPlayer(req.cookies)[0] // returns an array, deviceId is element 0, extend the body
  req.body.senderId = reqData.getPlayer(req.cookies)[0] // sender is the player here
  req.body.language = req.i18n.resolvedLanguage // is not being saved with the message, but is used for player update
  const response = await entity.postMessage(req.body) // get player data with deviceId  
  if(response.resultCode!==0){

    console.log(response)
    
  } else {
    // player has been updated possibly
    if(response.updateRegistration){  // can be done asynchroneously
      const player = await entity.getPlayer(reqData.getPlayer(req.cookies)[0]) // base64 encode url safe deviceId
      if(player!==null){
          res.clearCookie("player") // reset cookie 
          if(player!==null) res.cookie('player', reqData.getPlayerCookie(player), reqData.getPlayerCookieOptions(reqData.getCookiePermission(req.cookies)))
      }
    }
    res.redirect('/about')
  }

})

app.use(async (req, res) => {
    res.status(404).render('error', await pageData.getPageData('error', req.i18n.resolvedLanguage))
})
