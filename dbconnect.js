const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const url = process.env.MONGODB_URI
const connect = mongoose.connect(url)
module.exports = connect
