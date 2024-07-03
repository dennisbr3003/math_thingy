const express = require('express')
const path = require('path') 
const Log = require('./classes/Log')
const PageData = require('./classes/PageData')
const Localize = require('./classes/Localize')

const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

// oldest logfile: 20240522.log
require('dotenv').config()

i18next
.use(Backend)
.use(i18nextMiddleware.LanguageDetector)
.init({
  backend: {
    loadPath: __dirname + '/locales/{{lng}}.json',
  },
  detection: {
    order: ['querystring', 'cookie'],
    caches: ['cookie']
  },
  fallbackLng: 'en',
  preload: ['en', 'nl', 'fr', 'de']
});

const app = express()

const log = new Log(__dirname)
const pageData = new PageData()
const localize = new Localize()

app.set('view engine', 'ejs')
app.set('views', 'views') 

log.write('', 'Start app.js')

app.listen(process.env.PORT) 

log.write('', `Listening on port ${process.env.PORT}`)

app.use(express.static(path.join(__dirname, "public")));

app.use(i18nextMiddleware.handle(i18next));

// middleware to check any incomming call. Ideal for logging
app.use((req, res, next)=> {
    log.write('', '', req)
    next()
})

app.get('/', async (req, res) => {   
    let lng = localize.getBrowserLanguage(req)
    console.log(req.i18n.language, lng)
    await req.i18n.changeLanguage(localize.getBrowserLanguage(req))
    console.log(req.i18n.t('greeting'))
    res.render('index', pageData.getPageData('main', lng))
})

app.get('/switch/:lang', (req, res) => {
    const { lang } = req.params;
    console.log(lang)
    //res.cookie('lang', lang); // save language cookie 
    res.redirect('back'); // Redirect back to the previous page
  });

app.use(async (req, res) => {
    log.write('ERR', 'Navigation error (404)', req)
    let lng = localize.getBrowserLanguage(req)
    await req.i18n.changeLanguage(localize.getBrowserLanguage(req))
    res.status(404).render('error', pageData.getPageData('error', lng))
})
