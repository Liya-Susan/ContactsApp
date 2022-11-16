if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
  

const express = require('express')
const app = express()
const contactController = require('./controllers/contactController')
const path = require('path');

const exphbs = require('express-handlebars');
const bodyparser= require('body-parser')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(process.env.PORT || 3000)

app.use('/contact',contactController)
