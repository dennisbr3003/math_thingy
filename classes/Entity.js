const Log = require('../classes/Log')
const axioslib = require('axios')
const Cryptr = require('cryptr');

require('dotenv').config()

axios = axioslib.create({
    baseURL: process.env.API
});

require('dotenv').config()

class Entity {
    
    constructor(root){
        this.root = root
        this.log = new Log(this.root)
        this.log.prepare() // quick init
        this.cryptr = new Cryptr(process.env.CPWD)
        this.config = {}
    }

    async getPlayerByAxios(deviceId) {
        try{
            this.#createHash()
            const result = await axios.get(`/player/${deviceId}`, this.config)        
            return result.data
        } catch (err) {          
            console.log(err.response)
            if(typeof err.response==='undefined'){
                this.log.write('', `Entity: getPlayerByAxios failed. Message: API may not be reachable (${err.code})`)
            } else {
                this.log.write('', `Entity: getPlayerByAxios failed. Message: ${err.response.data.message} (${err.response.data.type})`)
            }    
            return null
        }
    }

    #createHash() {
        this.config = {
            headers: {
                'token': this.cryptr.encrypt(`${process.env.CAPP}.${+Date.now() + +process.env.CVALIDITY}`),
            }
        }
    }
}

module.exports = Entity