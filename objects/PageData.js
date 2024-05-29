class PageData {

    constructor(){
        this.data = new Object()
    }

    getPageData(){
        this.data.year = new Date().getFullYear().toString()
        return this.data
    }    
}

module.exports = PageData