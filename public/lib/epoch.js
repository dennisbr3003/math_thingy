
class Epoch {

    constructor(newsession, translations){
        this.newsession = newsession // true (session===null) / false (session!==null)
        this.translations = translations
    }

    getElapsedTimeAsString(){

        let lastvisit = +localStorage.getItem("visit")
        if(lastvisit===null)lastvisit=0
    
        if(this.newsession){ // no session = first entry
            localStorage.setItem("visit", Date.now())    
            localStorage.setItem("prevvisit", lastvisit)
        }    
    
        if(lastvisit===''||lastvisit===null) return this.translations.firstVisit
        return this.translations.subsequentVisit.replace('{param1}', this.#getElapsedTime(+localStorage.getItem('prevvisit')))  

    }
    
    #getElapsedTime (lastvisit) {    
    
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
    
        if(days!==0) return `${days} ${this.#getTagDay(days)}, ${hours} ${this.#getTagHour(hours)}, ${minutes} ${this.#getTagMinutes(minutes)} ${this.translations.and} ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours!==0) return `${hours} ${this.#getTagHour(hours)}, ${minutes} ${this.#getTagMinutes(minutes)} ${this.translations.and} ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours===0&&minutes!==0) return `${minutes} ${this.#getTagMinutes(minutes)} ${this.translations.and} ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours===0&&minutes===0) return `${seconds} ${this.#getTagSeconds(seconds)}`
        return ''
    }    
    
    #getTagDay = (val) => {
        return val!==1?this.translations.days:this.translations.day
    }
    
    #getTagHour = (val) => {
        return val!==1?this.translations.hours:this.translations.hour
    }
    
    #getTagMinutes = (val) => {
        return val!==1?this.translations.minutes:this.translations.minute
    }
    
    #getTagSeconds = (val) => {
        return val!==1?this.translations.seconds:this.translations.second
    }    

}

//https://javascript.info/import-export

export { Epoch }