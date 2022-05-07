require('./db/mongoose_connect')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const multer = require('multer')
const path = require('path')
const hbs = require('hbs')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const cors = require('cors')
const initRoutes = require('./routers/index')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const dataRouter = require('./routers/data')
const { addUser, getUser, getUserByName } = require('./utils/users')
const { addDevice, getDevice, getDeviceByName, addStat, addSensors } = require('./utils/devices')
const { saveDataToCollection } = require('./utils/saveSocketData')

var corsOptions = {
  origin: "http://localhost:8081"
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
initRoutes(app)
app.use(taskRouter)
app.use(dataRouter)
app.use(userRouter)

// Define paths for Express config
const publicdir = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(publicdir))


// ------------------------------------------------------------------------------------------------------------
// SocketIO - Connection
// ------------------------------------------------------------------------------------------------------------
io.on('connection', (socket) => {

  console.log('Connected')
  // console.log("JWT token test: ", socket.handshake.headers)

  // get socket ID
  const userID = socket.id
  console.log("SocketID: ", userID)

  // get header info
  const userAgent = socket.handshake.headers["user-agent"]
  console.log("user-agent: ", userAgent)
  addDevice({ id: userID, username: userAgent }) // add device

  const userAddress = socket.handshake.headers["x-forwarded-for"]
  console.log("address: ", userAddress)

  // store userInfo
  const userInfo = addUser({ id: userID, username: userAgent, address: userAddress })
  // console.log("userInfo: ", userInfo)

  // send info back to client
  io.to(userInfo.id).emit('joined', {

    id: userInfo.id,
    username: userInfo.username,
    address: userInfo.address

  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to web cleint
  // ------------------------------------------------------------------------------------------------------------
  socket.on('event_control', (device, cb) => {

    if (getUserByName(device.username)) {

      // get user info
      const { id, username, address } = getUserByName(device.username)
      const sDevice = getDevice(id)

      // ------------------------------------------------------------------------------------------------------------
      // Request Settings value
      // ------------------------------------------------------------------------------------------------------------
      if (device.reqSettings) {

        io.to(id).emit('req_settings', {

          id: id,
          username: username,
        })
      }

      // ------------------------------------------------------------------------------------------------------------
      // Request relay stats
      // ------------------------------------------------------------------------------------------------------------
      if (device.reqRelayStats) {

        io.to(id).emit('req_relay_stats', {

          id: id,
          username: username,
        })
      }

      // ------------------------------------------------------------------------------------------------------------
      // Manual mode
      // ------------------------------------------------------------------------------------------------------------
      if (device.isManualMode) {

        io.to(id).emit('manual_control', {

          id: id,
          username: username,
          isManualMode: device.isManualMode
        })
      }

      // ------------------------------------------------------------------------------------------------------------
      // relay control
      // ------------------------------------------------------------------------------------------------------------
      if (device.relay1) {

        io.to(id).emit('control_relay_1', {

          id: id,
          username: username,
          relay1: device.relay1
        })

        // update device stats
        sDevice.stat['relay1'] = device.relay1

      }

      if (device.relay2) {

        io.to(id).emit('control_relay_2', {

          id: id,
          username: username,
          relay2: device.relay2
        })

        // update device stats
        sDevice.stat['relay2'] = device.relay2

      }

      if (device.relay3) {

        io.to(id).emit('control_relay_3', {

          id: id,
          username: username,
          relay3: device.relay3
        })

        // update device stats
        sDevice.stat['relay3'] = device.relay3

      }

      if (device.relay4) {

        io.to(id).emit('control_relay_4', {

          id: id,
          username: username,
          relay4: device.relay4
        })

        // update device stats
        sDevice.stat['relay4'] = device.relay4

      }

      if (device.relay5) {

        io.to(id).emit('control_relay_5', {

          id: id,
          username: username,
          relay5: device.relay5
        })

        // update device stats
        sDevice.stat['relay5'] = device.relay5

      }

      // ------------------------------------------------------------------------------------------------------------
      // Update Sketch
      // ------------------------------------------------------------------------------------------------------------
      if (device.updateSketch) {

        io.to(id).emit('update_sketch', {

          id: id,
          username: username,
        })

        // update device stats
        // sDevice.stat['relay1'] = device.relay1

      }

      // ------------------------------------------------------------------------------------------------------------
      // Restart Board
      // ------------------------------------------------------------------------------------------------------------
      if (device.restartBoard) {

        io.to(id).emit('restart_board', {

          id: id,
          username: username,
        })

        // update device stats
        // sDevice.stat['relay1'] = device.relay1

      }



    } else {
      return cb('id not found, device not exist')
    }
  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to web cleint - Send back device stats
  // ------------------------------------------------------------------------------------------------------------
  socket.on('reqDevice', (dev) => {

    if (dev.username) {

      // get device
      const device = getDeviceByName(dev.username)

      // send device stats back to who request
      io.to(dev.ClientId).emit('deviceInfo', device)

    }

  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to Settings values
  // ------------------------------------------------------------------------------------------------------------
  socket.on('res_settings', (data) => {

    console.log('res_settings: ', data)

    const sDevice = getDevice(data.id)
    const deviceSettings = data
    delete deviceSettings.id
    sDevice.settings = deviceSettings // remove 1 element(id)

  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to Relay Stats
  // ------------------------------------------------------------------------------------------------------------
  socket.on('res_relay_stats', (data) => {

    console.log('res_relay_stats: ', data)

    const sDevice = getDevice(data.id)
    const relayStats = data
    delete relayStats.id
    sDevice.stat = relayStats // remove 1 element(id)
  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to temp sensor
  // ------------------------------------------------------------------------------------------------------------
  socket.on('dsTemp', (data) => {

    console.log('dsTemp: ', data)

  })

  // ------------------------------------------------------------------------------------------------------------
  // Listen to sensors.
  // ------------------------------------------------------------------------------------------------------------
  socket.on('sensors', (data) => {

    console.log('sensors: ', data)

    const { username } = getUser(data.id)
    saveDataToCollection({ data, username: username })

    const sensorsData = data
    delete sensorsData.id
    addSensors({ username: username, sensors: sensorsData})

  })




  socket.on('disconnect', () => {

    console.log('Disconnected')

  })
})


server.listen(port, () => {

  console.log(`Server is up on port ${port}`)

})

