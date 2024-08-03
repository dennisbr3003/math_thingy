const Log = require('../classes/Log')
const axioslib = require('axios')

axios = axioslib.create({
    baseURL: process.env.API
});

require('dotenv').config()

class Entity {
    
    constructor(root){
        this.root = root
        this.log = new Log(this.root)
        this.log.prepare() // quick init
    }

    async getPlayerByAxios(deviceId) {
        try{
            const result = await axios.get(`/player/${deviceId}`)        
            return result.data
        } catch (err) {
            this.log.write('', `Entity: getPlayerByAxios failed. Message: ${err.message}`)
            return null
        }
    }

}

module.exports = Entity