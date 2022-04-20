const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const multer = require('multer')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

// ********
const cors = require("cors")
const initRoutes = require("./routers")
const { addUser } = require('./utils/users')
var corsOptions = {
  origin: "http://localhost:8081"
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
initRoutes(app)


io.on('connection', (socket) => {

  console.log('Connected')
  console.log("JWT token test: ", socket.handshake.headers)

  // get socket ID
  const userID = socket.id
  console.log("SocketID: ", userID)

  // get header info
  const userAgent = socket.handshake.headers["user-agent"]
  console.log("user-agent: ", userAgent)

  const userAddress = socket.handshake.headers["x-forwarded-for"]
  console.log("address: ", userAddress)

  // store userInfo
  const userInfo = addUser({ id: userID, username: userAgent, address: userAddress })
  console.log("userInfo: ", userInfo)

  // send info back to client
  io.to(userInfo.id).emit('joined', {

    id: userInfo.id,
    username: userInfo.username,
    address: userInfo.address

  })


  socket.on('event_relay', (device) => {

    // get user
    const { id, username, address } = getUser(device.username)

    io.to(id).emit("control_relay", {

      id: id,
      username: username,
      relay1: device.relay1,
      relay2: device.relay2

    })

  })

  // socket.on('event_name', (data) => {

  //   console.log("Message from Client : ", data)
  //   socket.broadcast.emit("Send Message socket.broadcast.emit : ", data) // to all connected clients except who we send
  //   io.emit("Send Message io.emit Broadcasted : ", data)
  //   socket.emit("Send Message : ", data)

  // })

  socket.on('disconnect', () => {

    console.log('Disconnected')

  })
})


server.listen(port, () => {

  console.log(`Server is up on port ${port}`)

})

