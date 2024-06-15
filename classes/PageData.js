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
                this.data.epoch = this.datetime.getEpoch()        
                break;
            case 'error':
                // do nothing for now
                this.data.errortext = 'Oh no!! You totally broke Math Thingy\'s official home page!'
                this.data.hometext = 'Click here to get a fresh start!'
                break;
        }
        // always do this
        this.data.cssfile = page
        return this.data
    }    
}

module.exports = PageData