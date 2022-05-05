require('dotenv').config()

const { MongoClient, ObjectId } = require('mongodb')
const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const upload = require('./upload')

const port = process.env.PORT || 3000
const app = express()

app.use(cors({ origin: '*' }))
app.use(fileUpload())
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('books')
    const booksCollection = db.collection('books')

    // Список книг
    app.get('/books', function (req, res) {
      const userId = req.headers['user-id']
      const filter = userId ? { userId } : {}
      booksCollection.find(filter).toArray()
        .then(results => {
          res.json(results)
        })
        .catch(error => console.error(error))
    })

    // Книга по id
    app.get('/books/:id', function (req, res) {
      booksCollection.findOne({ _id: new ObjectId(req.params.id) })
        .then(results => {
          res.json(results)
        })
        .catch(error => console.error(error))
    })

    // Добавление книги
    app.post('/books', (req, res) => {
      const userId = req.headers['user-id']
      const cover = req?.files?.cover

      if (cover) {
        upload(cover).then(data => {
          booksCollection.insertOne({
            author: req.body.author,
            title: req.body.title,
            imageUrl: data.Location,
            ...(userId ? { userId } : {})
          }).then(result => {
            res.json(result)
          })
        })
      } else {
        booksCollection.insertOne({
          author: req.body.author,
          title: req.body.title,
          ...(userId ? { userId } : {})
        }).then(result => {
          res.json(result)
        })
      }
    })

    // Удаление книги
    app.delete('/books/:id', (req, res) => {
      booksCollection.deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
          res.json(result)
        })
    })

    // Обновление книги
    app.put('/books/:id', (req, res) => {
      const cover = req?.files?.cover

      if (cover) {
        upload(cover).then(data => {
          booksCollection.updateOne({ _id: new ObjectId(req.params.id) }, {$set: {
              author: req.body.author,
              title: req.body.title,
              imageUrl: data.Location,
            }})
            .then(result => {
              res.json(result)
            })
        })
      } else {
        booksCollection.updateOne({ _id: new ObjectId(req.params.id) }, {$set: {
            author: req.body.author,
            title: req.body.title,
          }})
          .then(result => {
            res.json(result)
          })
      }
    })

    app.listen(port, function() {
      console.log('listening on 3000')
    })

  })
