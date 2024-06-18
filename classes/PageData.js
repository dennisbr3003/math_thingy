const DateTime = require('./DateTime')
const Localize = require('./Localize')

class PageData {

    constructor(){
        this.data = new Object()                
        this.datetime = new DateTime()
        this.localize = new Localize()
    }

    getPageData(page, lang){
        console.log(page, lang)
        switch(page){
            case 'main':
                this.data.year = this.datetime.getYear()
                this.data.generated = this.datetime.getTime()        
                this.data.epoch = this.datetime.getEpoch()     
                this.data.translations = this.localize.getIndexTranslations(lang)
                break;
            case 'error':
                // do nothing for now
                break;
        }
        // always do this
        this.data.cssfile = page
        return this.data
    }    
}

module.exports = PageData