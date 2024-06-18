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
    order: ['querystring', 'cookie'],
    caches: ['cookie']
  },
  fallbackLng: 'en',
  preload: ['en', 'nl', 'fr', 'de']
});


class Localize {

    constructor(){
    }

    getBrowserLanguage(req) {
        return req.acceptsLanguages().length!==0?req.acceptsLanguages()[0]:'en-US'
    }

    getIndexTranslations(lang) {

        let translations = new Object()

        i18next.changeLanguage(lang)
        translations.firstVisit = i18next.t('index.firstVisit') 
        translations.subsequentVisit = i18next.t('index.subsequentVisit')
        translations.and = i18next.t('and')
        translations.day = i18next.t('metrics.day')
        translations.days = i18next.t('metrics.days')
        translations.hour = i18next.t('metrics.hour')
        translations.hours = i18next.t('metrics.hours')
        translations.minute = i18next.t('metrics.minute')
        translations.minutes = i18next.t('metrics.minutes')
        translations.second = i18next.t('metrics.seconds')
        translations.seconds = i18next.t('metrics.seconds')
        translations.footer = this.#getFooterTranslations(lang)     
        return translations
    }

    #getFooterTranslations (lang) {

        let translations = new Object()

        i18next.changeLanguage(lang)
        translations.copyright = i18next.t('footer.copyright')
        translations.generated = i18next.t('footer.generated')
        return translations

    }

}

module.exports = Localize