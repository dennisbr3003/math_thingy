const DateTime = require('./DateTime')
const Localize = require('./Localize')

const fs = require('fs')
const path = require('path') 
const os = require('os')

require('dotenv').config()

class Log {

    constructor (root) {
        this.root = root
    }    

    async #init(){

        let tmp = '' 
        this.datetime = new DateTime()
        this.localize = new Localize()
        this.location = this.root
        this.cleared = Date.now()

        await this.#checkLogFolder(process.env.LOGFOLDER)
        await this.#clearLogFiles()
        await this.#writeline(new Date(), this.#getLogFileName(new Date()), 'Cleared logfiles if needed')

        tmp = await this.#getversions()
        await this.#writeline(new Date(), this.#getLogFileName(new Date()), tmp)
        tmp = await this.#checkversion()
        await this.#writeline(new Date(), this.#getLogFileName(new Date()), tmp)

        await this.#writeline(new Date(), this.#getLogFileName(new Date()), `Root: ${this.root}`)
        await this.#writeline(new Date(), this.#getLogFileName(new Date()), 'Started app.js')
        await this.#writeline(new Date(), this.#getLogFileName(new Date()), `Listening on port ${process.env.PORT}`)
      
    }

    async initialize(){
        await this.#init()
    }

    async #getversions(){
        return `OS: ${os.platform()} | ${os.homedir()} | ${os.version()} | Node: ${process.versions.node}`
    }

    async #checkversion(){
        return process.versions.node<="20.1.0"?`Your node version ${process.versions.node} is too old. Please upgrade to 20.1.0 or better. Some functions may not work`:'Node version OK'
    }

    async write(type, text, req) {

        const dt = new Date()

        let reqtext = ''
        if(typeof req !== 'undefined'){
            reqtext=`http: ${req.httpVersion} | ${this.localize.getBrowserLanguage(req)} | host: ${req.hostname} | method: ${String(req.method).padEnd(7, ' ')} | url: ${req.url}`
        }
        
        let logfile = type.toUpperCase()==='ERR'?this.#getErrFileName(dt):this.#getLogFileName(dt)

        switch(process.env.LOGLEVEL) {
            case 'extended':
                this.#writeline(dt, logfile, reqtext===''?text:`${reqtext} | msg: ${text}`)
                break;
            case 'erroronly':
                if(type='ERR') this.#writeline(dt, logfile, reqtext===''?text:`${reqtext} | msg: ${text}`)
                break;    
        }               

        // check and clear files every 4 hours. Files older then 30 days (.env) are deleted
        if(Date.now() - this.cleared >= (4 * 60 * 60 * 1000)) this.#clearLogFiles()
    }

    #formatLine(dt, text){                      
        return `${this.datetime.getDate(dt, 'd,m,y', '-')} ${this.datetime.getTime(dt, 'h,m,s,ms')}  - ${text}`
    }

    #getLogFileName (dt) {
        return `${this.#getFileName(dt)}.log`
    }
    #getErrFileName (dt) {
        return `${this.#getFileName(dt)}.err`
    }

    #getFileName(dt){
        return `${this.datetime.getDate(dt, 'y,m,d', '')}`
    }

    async #writeline(dt, logfile, text){        
        fs.promises.writeFile(`./${process.env.LOGFOLDER}/${logfile}`, 
            `${this.#formatLine(dt, text)}\r\n`, 
            { flag: 'a+' },  
            (err) => {if(err) console.log(err)}) 
    }

    async #checkLogFolder (folder) {

        const folders = folder.split(path.sep)
        
        folders.forEach(el => {
            try {
                if (!fs.existsSync(path.join(this.root, el))) {
                    fs.mkdirSync(path.join(this.root, el));
                }
                this.location = path.join(this.location, el)
            } catch (err) {
                console.error(err);
            }                        
        })        
        this.#writeline(new Date(), this.#getLogFileName(new Date()), `Logfolder: ${this.location} - created or present`)
    }

    async #clearLogFiles(){
        const foldercontent = await fs.promises.readdir(this.location, {withFileTypes: true})
        foldercontent.forEach(element => {
             if(element.isFile()){
                // path is deprecated since v20.1.0
                fs.promises.stat(`${element.parentPath}${element.name}`, (err, stat) => {
                    if(err){
                        console.log(err)
                    } else {
                        //check if the file is older then 30 days (in millies). If so, then delete the file
                        if((stat.mtimeMs - (new Date(stat.mtime).getTimezoneOffset() * 60 * 1000)) + 
                           (process.env.LOGLIVE * 24 * 60 * 60 * 1000) < Date.now()){
                            fs.promises.unlink(`${element.parentPath}${element.name}`,(err => {
                                if(err) console.log(err.message)                        
                                else this.#writeline(new Date(), this.#getLogFileName(new Date()), `Deleted ${element.parentPath}${element.name}`)
                           }))
                        }
                    }
                })
             }
        })
        this.cleared = Date.now()
    }

}

module.exports = Log
