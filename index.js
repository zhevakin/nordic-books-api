require('dotenv').config()

const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const booksRoute = require('./routes/books')

const port = process.env.PORT || 3000
const app = express()

app.use(cors({ origin: '*' }))
app.use(fileUpload())
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

app.use('/books', booksRoute)

app.listen(port, function() {
  console.log('listening on 3000')
})
