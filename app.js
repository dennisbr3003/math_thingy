const express = require('express')
const path = require('path') 
const cookieParser = require('cookie-parser')
const compression = require('compression')

const Log = require('./classes/Log')
const PageData = require('./classes/PageData')
const Entity = require('./classes/Entity')

const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

require('dotenv').config()

const initApp = async () => {
  await log.init()
  await entity.init() 
}

i18next
.use(Backend)
.use(i18nextMiddleware.LanguageDetector)
.init({
  backend: {
    loadPath: __dirname + '/locales/{{lng}}.json',
  },
  detection: {
    order: ['cookie', 'querystring', 'path', 'header'],
    caches: ['cookie'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupHeader: 'accept-language',
  },
  fallbackLng: 'en',
  preload: ['en', 'nl', 'fr', 'de']
});


const app = express()

const log = new Log(__dirname)
const entity = new Entity(__dirname)
const pageData = new PageData(__dirname)

app.use(cookieParser())
app.use(compression()); /* https://www.geeksforgeeks.org/how-to-do-compression-with-gzip-in-node-js/ */

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.listen(process.env.PORT) 
// convenient to start the app from the terminal
console.log('ready to receive requests on ', `http://localhost:${process.env.PORT}`)

initApp()

app.use(express.static(path.join(__dirname, "public")));

app.use(i18nextMiddleware.handle(i18next));

// middleware to check any incomming call. Ideal for logging
app.use((req, res, next)=> {
    log.listCookies(req)
    log.write('', '', req)
    next()    
})


app.get('/', async (req, res) => {
  res.redirect('/start')
})

// this is comming in from the math thingy app
app.get('/signin/:deviceId?', async (req, res) => {
  const setcookie = !!req.params.deviceId ?? false
  // init cookie
  res.clearCookie("player")
  if(setcookie) {
    const player = await entity.getPlayer(req.params.deviceId)
    if(player!==null) res.cookie('player', JSON.stringify([player.device, player.displayname]), { maxAge: (30 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'strict'})
  }
  res.redirect('/start')
})

app.get('/start', (req, res) => {
  let playerArray = null
  for (let key in req.cookies){ // naar class
    if (req.cookies.hasOwnProperty(key) && key==='player'){
      //const arr = JSON.parse(req.cookies[key])
      //param = arr[1]!==''?arr[1]:arr[0]
      playerArray = JSON.parse(req.cookies[key])
    }
  }
  // param can be null or have a (string) value or even not passed
  res.render('index', pageData.getPageData('index', req.i18n.resolvedLanguage, playerArray))
})

app.get('/switch/:lng', async (req, res) => {
    const { lng } = req.params;
    res.cookie('i18next', lng)
    res.redirect('back'); // Redirect back to the previous page, this reloads the page the request came from
});

app.get('/about', (req, res) => {
  res.render('about', pageData.getPageData('about', req.i18n.resolvedLanguage))
})

app.use(async (req, res) => {
    log.write('ERR', 'Navigation error (404)', req)
    res.status(404).render('error', pageData.getPageData('error', req.i18n.resolvedLanguage))
})
