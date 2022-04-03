const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000


io.on('connection', (socket) => {

  console.log('Connected')
  console.log(socket.id)
  console.log("JWT token test: ",socket.handshake.headers)

  socket.on('event_name', (data) => {

    console.log("Message from Client : ", data)

    socket.broadcast.emit("Send Message socket.broadcast.emit : ", data)
    io.emit("Send Message io.emit Broadcasted : ", data)
    socket.emit("Send Message : ", data)

  })
  
  socket.on('disconnect', () => {

    console.log('Disconnected')

  })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)

})

