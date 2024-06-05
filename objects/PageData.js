const DateTime = require('./DateTime')

class PageData {

    constructor(){
        this.data = new Object()        
        this.datetime = new DateTime()
    }

    getPageData(page){
        switch(page){
            case 'main':
                this.data.year = this.datetime.getYear()
                this.data.generated = this.datetime.getTime()        
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