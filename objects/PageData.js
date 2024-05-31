const DateTime = require('./DateTime')

class PageData {

    constructor(){
        this.data = new Object()        
        this.datetime = new DateTime()
    }

    getPageData(cssfile){
        this.data.year = this.datetime.getYear()
        this.data.generated = this.datetime.getTime()
        this.data.cssfile = cssfile
        return this.data
    }    
}

module.exports = PageData