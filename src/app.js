// const path = require('path')
const http = require('http')
const express = require('express')
// const hbs = require('hbs')
// const socketio = require('socket.io')
// const Filter = require('bad-words')
// const { generateMsg, generateLocMsg } = require('./utils/msg')
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

// // Routers
// const statusRouter = require('./routers/status')



const app = express()
// // app.use(express.json())
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// // Define paths for Express config
// const publicdir = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views')
// const partialsPath = path.join(__dirname, '../templates/partials')

// // Set partials
// hbs.registerPartials(partialsPath)

// // Setup handlebars engine and views location
// app.set('view engine', 'hbs')
// app.set('views', viewsPath)

// // Setup static directory to serve
// app.use(express.static(publicdir))

// // Routers
// app.use(statusRouter)


io.on('connection', (socket) => {

    console.log('Connected');
    console.log(socket.id);
    console.log("JWT token test: ",socket.handshake.headers)
  
    socket.on('event_name', (data) => {
  
      console.log("Message from Client : ", data);
  
      socket.broadcast.emit("Send Message socket.broadcast.emit : ", data);
      io.emit("Send Message io.emit Broadcasted : ", data);
      socket.emit("Send Message : ", data);
  
    })
    
    socket.on('disconnect', () => {
  
      console.log('Disconnected');
  
    })
  
  })


server.listen(8080, () => {
    // server.listen(port, () => {
    console.log(`Server is up on port 8080`)

})

