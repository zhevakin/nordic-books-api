require('dotenv').config()

const { MongoClient, ObjectId } = require('mongodb')
const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())

app.use(cors({ origin: '*' }))

MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('books')
    const booksCollection = db.collection('books')

    app.get('/books', function (req, res) {
      booksCollection.find().toArray()
        .then(results => {
          res.json(results)
        })
        .catch(error => console.error(error))
    })

    app.post('/books', (req, res) => {
      booksCollection.insertOne({
        author: req.body.author,
        title: req.body.title,
      }).then(result => {
        res.json(result)
      })
    })

    app.delete('/books/:id', (req, res) => {
      booksCollection.deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
          res.json(result)
        })
    })

    app.put('/books/:id', (req, res) => {
      booksCollection.updateOne({ _id: new ObjectId(req.params.id) }, {$set: {
          author: req.body.author,
          title: req.body.title,
        }})
        .then(result => {
          res.json(result)
        })
    })

    app.listen(port, function() {
      console.log('listening on 3000')
    })

  })
