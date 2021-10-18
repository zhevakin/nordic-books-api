const express = require('express')
const dbconnect = require('./../dbconnect')
const Chats = require('./../models/ChatSchema')

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
    console.log(req.body)
    const chat = new Chats({ title: req.body.title })
    chat.save(() => {
      res.json(chat)
    })
  })
})

module.exports = router
