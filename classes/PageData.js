const DateTime = require('./DateTime')
const Localize = require('./Localize')
const Log = require('../classes/Log')
const lib = require('../lib/uuid')

const fs = require('fs')
const path = require('path') 

class PageData {

    constructor(root){
        this.root = root
        this.data = {}
        this.datetime = new DateTime()
        this.localize = new Localize()
        this.log = new Log(this.root)
        this.log.prepare() // quick init
        this.dependencies = this.#readPackageJson()
        this.lastModified = this.#getLastModificationDateTime(path.join(this.root, 'package.json'))
    }

    getPageData(page, lang, playerArray, pnonce){
        const player = playerArray ?? []
        const nonce = pnonce ?? ''
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
                this.data.translations = this.localize.getIndexTranslations(player)
                break;
            case 'error':
                // do nothing for now
                break
            case 'about':
                this.#createAboutData(player)                
                break
        }
        // always do this
        this.data.year = this.datetime.getYear()
        this.data.generated = this.datetime.getTime()        
        this.data.epoch = this.datetime.getEpoch()     
        this.data.hometext = this.localize.getHomeButtonText(page)        
        this.data.playerDevice = player.length!==0?player[0]:''
        this.data.playerName = player.length!==0?player[1]:''
        this.data.cssfile = page
        this.data.nonce = nonce // essential for CSP for inline scripting (as seen in index page). Fail to pass this and the inline script will not run
        return this.data
    }    

    async #readPackageJson(){
        try{
            this.dependencies = JSON.parse(await fs.promises.readFile(path.join(this.root, 'package.json'))).dependencies
            this.log.write('', `Dependencies read: ${path.join(this.root, 'package.json')}`)
        } catch (err) {
            this.log.write('', `Dependencies could not be read: ${err.message}`)
        }
    }

    async #createAboutData(player) {
        lib.isEmpty(this.dependencies) ? await this.#readPackageJson() : false
        
        this.data.versions=[]
        this.data.versions.push({name: 'Node', version: process.versions.node, img: 'node_logo.svg'})
        this.data.versions.push({name: 'Express', version: this.#getVersion('express'), img: 'express_logo_small.webp'})
        this.data.versions.push({name: 'JavaScript', version: '', img: 'js_logo.svg'})
        this.data.versions.push({name: 'EJS (Embedded JavaScript)', version: this.#getVersion('ejs'), img: 'ejs_logo.svg'})        
        this.data.versions.push({name: 'Compression for Node', version: this.#getVersion('compression'), img: 'gzip-black.webp'})
        this.data.versions.push({name: 'Tailwind CSS', version: this.#getVersion('tailwindcss'), img: 'tailwind_logo.svg'})
        this.data.versions.push({name: 'URL safe Base64', version: this.#getVersion('url-safe-base64'), img: 'base64.webp'})
        this.data.versions.push({name: 'Cryptr', version: this.#getVersion('cryptr'), img: 'encryption.webp'})
        this.data.versions.push({name: 'i18next (internationalization)', version: this.#getVersion('i18next'), img: 'i18next.svg'})
        this.data.versions.push({name: 'Cookie Parser', version: this.#getVersion('cookie-parser'), img: 'cookieparser-border.webp'})
        this.data.versions.push({name: 'Axios HTTP client', version: this.#getVersion('axios'), img: 'axios.webp'})
        this.data.versions.push({name: 'Express CSP header', version: this.#getVersion('express-csp-header'), img: 'cspheader.webp'})        
        this.data.versions.push({name: 'Helmet (Security for Node)', version: this.#getVersion('helmet'), img: 'cartwheel_small.webp'})

        this.data.lastModified = `${this.datetime.getDate(new Date(this.lastModified), 'd,m,y')} ${this.datetime.getTime(new Date(this.lastModified))}`               
    }

    #getVersion(module){
        return this.dependencies[module].substring(1)
    }

    async #getLastModificationDateTime(file) {
        let dttm = await fs.promises.stat(file)
        this.lastModified = dttm.mtime
    }

}

module.exports = PageData