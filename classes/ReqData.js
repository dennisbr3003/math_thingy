class ReqData {
    constructor(){

    }

    getCookiePermission(cookieCollection){
        let permission = false
        for (let key in cookieCollection){ // naar class
            if (cookieCollection.hasOwnProperty(key) && key==='mt_cookies_allowed'){
                permission = cookieCollection[key]
            }
        }
        return permission
    }

    getPlayer(cookieCollection){
        let playerArray = null
        for (let key in cookieCollection){ // naar class
            if (cookieCollection.hasOwnProperty(key) && key==='player'){
              playerArray = JSON.parse(cookieCollection[key])
            }
        }
        return playerArray
    }
}    

module.exports = ReqData