const DateTime = require('./DateTime')

class PageData {

    constructor(){
        this.data = new Object()        
        this.datetime = new DateTime()
    }

    getPageData(cssfile){
        let dt = new Date()
        this.data.year = this.datetime.getYear()
        this.data.generated = this.datetime.getTime(dt, 'h,m,s,ms')
        this.data.cssfile = cssfile
        return this.data
    }    
}

module.exports = PageData