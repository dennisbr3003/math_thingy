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
    const player = await entity.getPlayerByAxios(req.params.deviceId) // get player data with deviceId
    if(player!==null){
      if(reqData.getCookiePermission(req.cookies)){ // longterm cookie 
          res.cookie('player', JSON.stringify([player.device, player.displayname]), { maxAge: (30 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'strict'})
      } else { 
          // short term cookie = session cookie
          // https://stackoverflow.com/questions/10617954/chrome-doesnt-delete-session-cookies
          res.cookie('player', JSON.stringify([player.device, player.displayname]), { secure: true, sameSite: 'strict'})
      }
    }
  }
  res.redirect('/start')
})

app.get('/start', (req, res) => {
  res.render('index', pageData.getPageData('index', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.get('/switch/:lng', async (req, res) => {
    const { lng } = req.params;
    res.cookie('i18next', lng)
    res.redirect('back'); // Redirect back to the previous page, this reloads the page the request came from
});

app.get('/about', (req, res) => {
  res.render('about', pageData.getPageData('about', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.get('/about/contact', (req, res) => {
  res.render('contact', pageData.getPageData('contact', req.i18n.resolvedLanguage, reqData.getPlayer(req.cookies), req.nonce))
})

app.post('/about/contact', (req, res) => {
  console.log('player', reqData.getPlayer(req.cookies))
  // formData
  console.log('formData', req.body)

  /*
    player [ '56191af4-60a4-4b9b-be51-91056dd32f1e', '' ]
    formData {
      name: 'Dennis Brink',
      email: 'dennis.brink@villaforyou.com',
      message: 'ededseswd'
    }
  */

})

app.use(async (req, res) => {
    res.status(404).render('error', pageData.getPageData('error', req.i18n.resolvedLanguage))
})
