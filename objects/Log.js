const DateTime = require('./DateTime')

const fs = require('fs')
const path = require('path') 
const os = require('os')

require('dotenv').config()

class Log {

    constructor (root) {
        this.#init(root)
    }    

    #init(root){
        this.datetime = new DateTime()
        this.root = root
        this.location = root
        this.writes = Date.now()
        this.#checkLogFolder(process.env.LOGFOLDER)
        this.#clearLogFiles()
        this.write('', 'New session ------------')
        this.write('', `OS: ${os.platform()} | ${os.homedir()} | ${os.version()}`)
    }

    write(type, text, req) {

        const dt = new Date()

        let reqtext = ''
        if(typeof req !== 'undefined'){
            reqtext=`http: ${req.httpVersion} | host: ${req.hostname} | method: ${String(req.method).padEnd(7, ' ')} | url: ${req.url}`
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
        if(Date.now() - this.writes >= (4 * 60 * 60 * 1000)) this.#clearLogFiles()
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

    #writeline(dt, logfile, text){
        fs.writeFile(`./${process.env.LOGFOLDER}/${logfile}`, 
            `${this.#formatLine(dt, text)}\r\n`, 
            { flag: 'a+' },  
            (err) => {if(err) console.log(err)}) 
    }

    #checkLogFolder (folder) {

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
        });
    }

    async #clearLogFiles(){
        const foldercontent = await fs.promises.readdir(this.location, {withFileTypes: true})
        foldercontent.forEach(element => {
             if(element.isFile()){
                fs.stat(`${element.path}${element.name}`, (err, stat) => {
                    if(err){
                        console.log(err)
                    } else {
                        // check if the file is older then 30 days (in millies). If so, then delete the file
                        if((stat.mtimeMs - (new Date(stat.mtime).getTimezoneOffset() * 60 * 1000)) + 
                           (process.env.LOGLIVE * 24 * 60 * 60 * 1000) < Date.now()){
                            fs.unlink(`${element.path}${element.name}`)
                        }
                    }
                })
             }
        })
        this.writes = Date.now()
    }

}

module.exports = Log
