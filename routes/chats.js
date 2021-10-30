const express = require('express')
const dbconnect = require('./../dbconnect')
const Chats = require('./../models/ChatSchema')
const Messages = require('./../models/MessageSchema')

const router = express.Router()

router.route('/').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  dbconnect.then(db => {
    Chats.find({}).then(chat => {
      res.json(chat)
    })
  })
})

router.route('/').post((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  dbconnect.then(db => {
    const chat = new Chats({ title: req.body.title })
    chat.save(() => {
      res.json(chat)
    })
  })
})

router.route('/:chatId').delete((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  dbconnect.then(db => {
    Chats.findByIdAndRemove(req.params.chatId, req.body, (err) => {
      if (err) {
        res.json({
          error: err
        })
        return
      }
      res.json({
        status: 'ok'
      })
    })
  })
})

router.route('/:chatId/messages').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  dbconnect.then(db => {
    Messages.find({ chatId: req.params.chatId }).then(messages => {
      res.json(messages)
    })
  })
})

module.exports = router
