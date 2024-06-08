const express = require('express')
const path = require('path') 
const Log = require('./classes/Log')
const PageData = require('./classes/PageData')
// oldest logfile: 20240522.log
require('dotenv').config()

const app = express()

const log = new Log(__dirname)
const pageData = new PageData()

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
    res.render('index', pageData.getPageData('main'))
})

app.use((req, res) => {
    log.write('ERR', 'Navigation error (404)', req)
    res.status(404).render('error', pageData.getPageData('error'))
})
