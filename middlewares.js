const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const Log = require('./classes/Log')
const { expressCspHeader, NONCE, LINE } = require("express-csp-header")
const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

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

const log = new Log(__dirname)
log.init()

// using closure to export functions so the required modules can be added here. This cleans up app.js significantly

module.exports = [
    compression(), /* https://www.geeksforgeeks.org/how-to-do-compression-with-gzip-in-node-js/ */
    helmet(),
    /*
        this one crashes the app on the translations with the metric parameters and the inline shit in the languageswitcher or the click event added to it
        Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-1OrOxCJjSlmLRnBGOSDrysCyUbkWRmpVJGjiztTfSMk='), or a nonce ('nonce-...') is required to enable inline execution.
        solved it using: https://www.npmjs.com/package/express-csp-header + https://stackoverflow.com/questions/70924591/express-csp-ejs-inline-scripts-nonces-how-to
        Also see https://content-security-policy.com/nonce/ for the chosen solution (using a nonce)
    */
    cookieParser(),
    (req, res, next) => {
        log.listCookies(req)
        log.write('', '', req)
        next()  
    },    
    expressCspHeader({ // has to be called after the helemt() function. req is extended with the attribute 'nonce' (no capitals)
        directives: {"script-src": [NONCE, LINE]}
    }),    
    i18nextMiddleware.handle(i18next)
]