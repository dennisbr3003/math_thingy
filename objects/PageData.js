const DateTime = require('./DateTime')

class PageData {

    constructor(){
        this.data = new Object()        
        this.datetime = new DateTime()
    }

    getPageData(){
        let dt = new Date()
        this.data.year = this.datetime.getYear(dt)
        this.data.generated = this.datetime.getTime(dt, 'h,m,s,ms')
        return this.data
    }    
}

module.exports = PageData