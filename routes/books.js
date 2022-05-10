const express = require('express');
const { ObjectId } = require("mongodb");
const upload = require("../upload");
const dbConnect = require('../dbConnect');

const router = express.Router();

// Список книг
router.route('/').get(async (req, res) => {
  const booksCollection = (await dbConnect()).db('books').collection('books');

  const { pageSize = 10, page = 0 } = req.query
  const userId = req.headers['user-id']
  const filter = userId ? { userId } : {}
  const pageInt = parseInt(page)
  const pageSizeInt = parseInt(pageSize)
  const offsetInt = parseInt(pageInt * pageSizeInt)
  const data = await booksCollection.find(filter).sort({_id: -1}).skip(offsetInt).limit(pageSize).toArray()
  const total = await booksCollection.countDocuments(filter)
  const totalPages = Math.ceil(total / pageSizeInt)
  res.json({ data, page: pageInt, pageSize: pageSizeInt, totalPages, total })
})

// Книга по id
router.route('/:id').get( async (req, res) => {
  const booksCollection = (await dbConnect()).db('books').collection('books');

  booksCollection.findOne({ _id: new ObjectId(req.params.id) })
    .then(results => {
      res.json(results)
    })
    .catch(error => console.error(error))
})

// Добавление книги
router.route('/').post(async (req, res) => {
  const booksCollection = (await dbConnect()).db('books').collection('books');

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
router.route('/:id').delete(async (req, res) => {
  const booksCollection = (await dbConnect()).db('books').collection('books');

  booksCollection.deleteOne({ _id: new ObjectId(req.params.id) })
    .then(result => {
      res.json(result)
    })
})

// Обновление книги
router.route('/:id').put( async (req, res) => {
  const booksCollection = (await dbConnect()).db('books').collection('books');

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

// Комментарии
router.route('/:id/comments').get( async (req, res) => {
  const commentsCollection = (await dbConnect()).db('books').collection('comments');

  const data = await commentsCollection.find({ bookId: new ObjectId(req.params.id) }).toArray()
  res.json({
    data
  })
})

// Добавление комментария
router.route('/:id/comments').post(async (req, res) => {
  const commentsCollection = (await dbConnect()).db('books').collection('comments');

  const userId = req.headers['user-id']
  const bookId = new ObjectId(req.params.id)

  commentsCollection.insertOne({
    bookId,
    name: req.body.name,
    text: req.body.text,
    ...(userId ? { userId } : {})
  }).then(result => {
    res.json(result)
  })
})

module.exports = router;
