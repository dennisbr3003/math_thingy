const DateTime = require('./DateTime')
const Localize = require('./Localize')

class PageData {

    constructor(){
        this.data = new Object()                
        this.datetime = new DateTime()
        this.localize = new Localize()
    }

    getPageData(page, lang, playerArray){

        const player = playerArray ?? []

        this.localize.setLanguage(lang)
        this.data.selectedLanguage = {language: lang, description: 'not important'}    
        this.data.languages = [            
            {language: 'nl', description: 'Nederlands'},
            {language: 'en', description: 'English'},
            {language: 'de', description: 'Deutsch'},
            {language: 'fr', description: 'Français'}
        ]    
        switch(page){
            case 'index':
                this.data.year = this.datetime.getYear()
                this.data.generated = this.datetime.getTime()        
                this.data.epoch = this.datetime.getEpoch()     
                this.data.playerDevice = player.length!==0?player[0]:''
                this.data.playerName = player.length!==0?player[1]:''
                this.data.translations = this.localize.getIndexTranslations(player)
                break;
            case 'error':
                // do nothing for now
                break
            case 'about':
                // do nothing for now
                break
        }
        // always do this
        this.data.cssfile = page
        return this.data
    }    
}

module.exports = PageData