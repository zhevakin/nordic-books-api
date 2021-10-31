const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    text: {
      type: String,
    },
    name: {
      type: String,
    },
    userId: {
      type: String,
    },
    imageURL: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    }
  },
  {
    timestamps: true,
  })

let Message = mongoose.model('Message', messageSchema)
module.exports = Message
