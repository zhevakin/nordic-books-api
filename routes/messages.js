const express = require('express')
const dbconnect = require('./../dbconnect')
const Messages = require('./../models/MessageSchema')

const router = express.Router()

router.route('/:chatId').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  dbconnect.then(db => {
    Messages.find({ chatId: req.params.chatId }).then(messages => {
      res.json(messages)
    })
  })
})

module.exports = router
