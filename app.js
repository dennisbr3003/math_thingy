const express = require('express')
const path = require('path') 

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views') 

app.listen(3000)    

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => { res.render('index', {})})