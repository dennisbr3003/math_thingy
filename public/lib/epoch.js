
const getElapsedTimeAsString = (navtype, textfirst, textcalculated) => {
    
    /*
        navtypes: 
        0 navigate     lick click, entering of a URL, form submission, ...
        1 reload       reload click or location.reload()
        2 back_forward back/forward click or calling history.back()/history.forward()
        3 prerender    navigation initiated by a prerender hint
    */

    let lastvisit = +localStorage.getItem("visit")
    if(lastvisit===null)lastvisit=0

    if(navtype===0){
        localStorage.setItem("visit", Date.now())    
        localStorage.setItem("prevvisit", lastvisit)
    }    

    if(lastvisit===''||lastvisit===null) return textfirst
    return textcalculated.replace('{param1}', getElapsedTime(+localStorage.getItem('prevvisit')))  
    //if(lastvisit===''||lastvisit===null) return 'Hey it\'s your first time! Check out what\'s been going on below!'  
    //return `Hey stranger! Your last visit was ${getElapsedTime(+localStorage.getItem('prevvisit'))} ago. Check what happened since your last visit...` 
}

const getElapsedTime = (lastvisit) => {    

    let milliesElapsed=Date.now() - +lastvisit
    let seconds, minutes, hours, days, remaining

    remaining = milliesElapsed    
    days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    if(days!==0)remaining = remaining - (days * (1000 * 60 * 60 * 24))

    hours = Math.floor(remaining / (1000 * 60 * 60))
    if(hours!==0)remaining = remaining - (hours * (1000 * 60 * 60))

    minutes = Math.floor(remaining / (1000 * 60))
    if(minutes!==0)remaining = remaining - (minutes * (1000 * 60))

    seconds = Math.floor(remaining / (1000))
    if(seconds!==0)remaining = remaining - (seconds * 1000)

    if(days!==0) return `${days} ${getTagDay(days)}, ${hours} ${getTagHour(hours)}, ${minutes} ${getTagMinutes(minutes)} and ${seconds} ${getTagSeconds(seconds)}`
    if(days===0&&hours!==0) return `${hours} ${getTagHour(hours)}, ${minutes} ${getTagMinutes(minutes)} and ${seconds} ${getTagSeconds(seconds)}`
    if(days===0&&hours===0&&minutes!==0) return `${minutes} ${getTagMinutes(minutes)} and ${seconds} ${getTagSeconds(seconds)}`
    if(days===0&&hours===0&&minutes===0) return `${seconds} ${getTagSeconds(seconds)}`
    return ''
}    

const getTagDay = (val) => {
    return val!==1?'days':'day'
}

const getTagHour = (val) => {
    return val!==1?'hours':'hour'
}

const getTagMinutes = (val) => {
    return val!==1?'minutes':'minute'
}

const getTagSeconds = (val) => {
    return val!==1?'seconds':'second'
}

//https://javascript.info/import-export

export { getElapsedTimeAsString }