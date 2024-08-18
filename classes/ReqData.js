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

    getPlayerCookie(player){
        return JSON.stringify([player.deviceId, player.displayName, player.email])
    }
    getPlayerCookieOptions(permission){
        // short term cookie = session cookie (but could act as a longterm or permanent cookie). Changed to 4-hour cookie
        // https://stackoverflow.com/questions/10617954/chrome-doesnt-delete-session-cookies
        return permission?{ maxAge: (30 * 24 * 60 * 60 * 1000), secure: true, sameSite: 'strict'}:{ maxAge: (4 * 60 * 60 * 1000), secure: true, sameSite: 'strict'}
    }
}    

module.exports = ReqData