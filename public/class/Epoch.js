class Epoch {

    constructor(lastvisit){
        this.lastvisit = lastvisit
    }

    getElapsedTimeAsString(){

        if(this.lastvisit===''||this.lastvisit===null) return ''

        let milliesElapsed=Date.now() - +this.lastvisit
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

        if(days!==0) return `${days} ${this.#getTagDay(days)}, ${hours} ${this.#getTagHour(hours)}, ${minutes} ${this.#getTagMinutes(minutes)} and ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours!==0) return `${hours} ${this.#getTagHour(hours)}, ${minutes} ${this.#getTagMinutes(minutes)} and ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours===0&&minutes!==0) return `${minutes} ${this.#getTagMinutes(minutes)} and ${seconds} ${this.#getTagSeconds(seconds)}`
        if(days===0&&hours===0&&minutes===0) return `${seconds} ${this.#getTagSeconds(seconds)}`
        return ''
    }    

    #getTagDay(val) {
        return val!==1?'days':'day'
    }
    
    #getTagHour(val) {
        return val!==1?'hours':'hour'
    }
    
    #getTagMinutes(val) {
        return val!==1?'minutes':'minute'
    }

    #getTagSeconds(val) {
        return val!==1?'seconds':'second'
    }
}

//https://javascript.info/import-export

export { Epoch }