const Log = require('../classes/Log')
const axioslib = require('axios')
const Cryptr = require('cryptr')
const { encode } = require("url-safe-base64")
const { isBase64 }= require('is-base64')
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

    async getPlayer(deviceId) {
        if(!isBase64(deviceId)) deviceId = encode(btoa(deviceId))
        try{
            this.#createHash() // password hash for the API
            const player = await axios.get(`/player/${deviceId}`, this.config)
            return player.data
        } catch (err) {      
            if(typeof err.response==='undefined') this.log.write('', `Entity: getPlayer failed. Message: API may not be reachable (${err.code})`)
            else this.log.write('', `Entity: getPlayer failed. Message: ${err.response.data.message} (${err.response.data.type})`)
            return null
        }
    }

    async postMessage(message){
        try{
            this.#createHash() // password hash for the API
            const msg = await axios.post(`/message`, message, this.config)        
            return msg.data
        } catch (err) {
            if(typeof err.response==='undefined') this.log.write('', `Entity: postMessage failed. Message: API may not be reachable (${err.code})`)
            else this.log.write('', `Entity: postMessage failed. Message: ${err.response.data.message} (${err.response.data.type})`) 
            return null            
        }
    }

    async getUnreadMessageCount(deviceId){
        try{
            this.#createHash() // password hash for the API
            const msgCount = await axios.get(`/message/unread/${deviceId}`, this.config)        
            return msgCount.data.unreadMessages
        } catch (err) {
            if(typeof err.response==='undefined') this.log.write('', `Entity: postMessage failed. Message: API may not be reachable (${err.code})`)
            else this.log.write('', `Entity: postMessage failed. Message: ${err.response.data.message} (${err.response.data.type})`) 
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