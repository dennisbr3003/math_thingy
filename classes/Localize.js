const i18next = require('i18next')

class Localize {

    constructor(){
    }

    setLanguage(lang){
      i18next.changeLanguage(lang)
    }

    getLanguage(req) {
     for (var key in req.cookies) {
        if (req.cookies.hasOwnProperty(key)) {
            console.log(key + " -> " + req.cookies[key]);
        }
      }         
      return req.i18n.resolvedLanguage
      // return req.acceptsLanguages().length!==0?req.acceptsLanguages()[0]:'en-US'
    }

    getIndexTranslations() {

        let translations = new Object()
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
        translations.footer = this.#getFooterTranslations()     
        return translations
    }

    #getFooterTranslations () {

        let translations = new Object()
        translations.copyright = i18next.t('footer.copyright')
        translations.generated = i18next.t('footer.generated')
        return translations

    }

}

module.exports = Localize