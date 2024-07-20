const express = require('express')
const path = require('path') 
const cookieParser = require('cookie-parser')
const compression = require('compression')

const Log = require('./classes/Log')
const PageData = require('./classes/PageData')
const Localize = require('./classes/Localize')

const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

require('dotenv').config()

const initApp = async () => {
  await log.initLog()
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
const pageData = new PageData()
const localize = new Localize()

app.use(cookieParser())
app.use(compression());

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
    log.write('', '', req)
    next()    
})

app.get('/', async (req, res) => {   
    res.render('index', pageData.getPageData('index', req.i18n.resolvedLanguage))
})

app.get('/switch/:lng', async (req, res) => {
    const { lng } = req.params;
    res.cookie('i18next', lng)
    res.redirect('back'); // Redirect back to the previous page, this reloads the page
  });

app.use(async (req, res) => {
    log.write('ERR', 'Navigation error (404)', req)
    res.status(404).render('error', pageData.getPageData('error', req.i18n.resolvedLanguage))
})
