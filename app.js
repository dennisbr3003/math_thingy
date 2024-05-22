const express = require('express')
const path = require('path') 
const Log = require('./objects/Log')

require('dotenv').config()

const app = express()

const log = new Log(__dirname)

app.set('view engine', 'ejs')
app.set('views', 'views') 

log.write('', 'Start app.js')

app.listen(process.env.PORT) 

log.write('', `Listening on port ${process.env.PORT}`)

app.use(express.static(path.join(__dirname, "public")));

// middleware to check any incomming call. Ideal for logging
app.use((req, res, next)=> {
    log.write('', '', req)
    next()
})

app.get('/', (req, res) => {   
    res.render('index', {})
})