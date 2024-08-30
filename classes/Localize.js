const i18next = require('i18next')

class Localize {

    constructor(){
    }

    setLanguage(lang){
      i18next.changeLanguage(lang)
    }


    getErrorPageTranslations(trtype) {
        let translations = new Object()
        translations.apology = i18next.t(`500.${trtype}.apology`) 
        translations.possibility = i18next.t(`500.${trtype}.possibility`) 
        translations.again = i18next.t(`500.${trtype}.again`) 
        translations.forget = i18next.t(`500.${trtype}.forget`) 
        return translations
    }

    getIndexTranslations(player) {

        // 0 = device
        // 1 = name
        let playerName = player.length===3?player[1]!==''?player[1]:i18next.t('index.stranger'):i18next.t('index.stranger')

        // above statement replaces the snippet below
        // device = ''
        // if(params !== 'undefined' && params !== null){
        //     device = params
        // } 

        // https://www.i18next.com/translation-function/interpolation
        // optie 1 = translations.subsequentVisit = i18next.t('index.subsequentVisit', {stranger: i18next.t('index.stranger')})
        // optie 2 = const player = params ?? i18next.t('index.stranger')
        //           translations.subsequentVisit = i18next.t('index.subsequentVisit', {player: player})
        // The placeholder is called 'player' and if the const is also called 'player' you could shorten this to
        //           translations.subsequentVisit = i18next.t('index.subsequentVisit', { player })

        let translations = new Object()
        translations.firstVisit = i18next.t('index.firstVisit', { player: playerName }) 
        translations.subsequentVisit = i18next.t('index.subsequentVisit', { player: playerName })
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

    getHomeButtonText(page){
       return i18next.t(`${page}.hometext`)
    }

}

module.exports = Localize