// Hey stranger! Your last visit was ${getElapsedTimeAsString(+localStorage.getItem("visit"))} ago...here's what happened

const getElapsedTimeAsString = (lastvisit) => {
    if(lastvisit===''||lastvisit===null) return 'Hey it\'s your first time! Welcome!'  
    return `Hey stranger! Your last visit was ${getElapsedTime(+lastvisit)} ago. Here's what happened after your last visit...` 
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