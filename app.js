const express = require('express')
const path = require('path') 

const PageData = require('./classes/PageData')
const Entity = require('./classes/Entity')

require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views') 
app.listen(process.env.PORT) 

const entity = new Entity(__dirname)
const pageData = new PageData(__dirname)

// convenient to start the app from the terminal
console.log('ready to receive requests on ', `http://localhost:${process.env.PORT}`)

app.use(express.static(path.join(__dirname, "public")));
app.use(require('./middlewares.js'))

app.get('/', async (req, res) => {
  res.redirect('/start')
})

// this is comming in from the math thingy app
app.get('/signin/:deviceId?', async (req, res) => {
  const setcookie = !!req.params.deviceId ?? false
  // init cookie
  res.clearCookie("player")
  if(setcookie) {
    const player = await entity.getPlayerByAxios(req.params.deviceId)
    if(player!==null) res.cookie('player', JSON.stringify([player.device, player.displayname]), { maxAge: (30 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'strict'})
  }
  res.redirect('/start')
})

app.get('/start', (req, res) => {
  let playerArray = null
  for (let key in req.cookies){ // naar class
    if (req.cookies.hasOwnProperty(key) && key==='player'){
      playerArray = JSON.parse(req.cookies[key])
    }
  }
  // param can be null or have a (string) value or even not passed
  res.render('index', pageData.getPageData('index', req.i18n.resolvedLanguage, playerArray, req.nonce))
})

app.get('/switch/:lng', async (req, res) => {
    const { lng } = req.params;
    res.cookie('i18next', lng)
    res.redirect('back'); // Redirect back to the previous page, this reloads the page the request came from
});

app.get('/about', (req, res) => {
  let playerArray = null
  for (let key in req.cookies){ // naar class
    if (req.cookies.hasOwnProperty(key) && key==='player'){
      playerArray = JSON.parse(req.cookies[key])
    }
  }  
  res.render('about', pageData.getPageData('about', req.i18n.resolvedLanguage, playerArray, req.nonce))
})

app.use(async (req, res) => {
    res.status(404).render('error', pageData.getPageData('error', req.i18n.resolvedLanguage))
})
