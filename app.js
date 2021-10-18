const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const chatsRoute = require('./routes/chats')
const MessageSchema = require('./models/MessageSchema')
const dbconnect = require('./dbconnect')

const app = express()

app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, constious SmartTVs) choke on 204
}
app.use(cors(corsOptions))

const http = require('http').Server(app)
const port = process.env.PORT

// api
app.use('/chats', chatsRoute)

// Sockets
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', socket => {
  socket.on('new message', function (message) {
    console.log('new message', message)

    //save chat to the database
    dbconnect.then(db => {
      const newMessage = new MessageSchema({ chatId: message.chatId, text: message.text, name: message.name })
      newMessage.save((err, value) => {
        io.emit('new message', value)
      })
    })
  })
})

http.listen(port, () => {
  console.log('connected to port: ' + port)
})
