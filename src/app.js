const path      = require('path')
const http      = require('http')
const express   = require('express')
const hbs       = require('hbs')
const socketio  = require('socket.io')
const Filter    = require('bad-words')
const { generateMsg, generateLocMsg } = require('./utils/msg')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')



const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// Define paths for Express config
const publicdir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set partials
hbs.registerPartials(partialsPath)

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)

// Setup static directory to serve
app.use(express.static(publicdir))


const msg = 'Welcome!'

io.on('connection', (socket) => {

    // Message
    console.log('New WebSocket connection')


    // Room
    socket.on('join', (opt, callback) => {

        // Add user
        const { S_user, error } = addUser({ id: socket.id, ...opt })
        // console.log("Debug: " + S_user.id)

        if (error) {
            return callback(error)
        }

        socket.join(S_user.room)

        socket.emit('msg', generateMsg('System', msg))
        socket.broadcast.to(S_user.room).emit('msg', generateMsg('System', `${S_user.username} has joined`))

        // Update list when client join
        io.to(S_user.room).emit('roomData', {
            room: S_user.room,
            users: getUsersInRoom(S_user.room)
        })

        callback()
    })


    socket.on('sendMsg', (m, callback) => {
        const filter = new Filter()

        if (filter.isProfane(m)) {
            return callback('Profanity is not allowed')
        }

        const {username, room} = getUser(socket.id)
        io.to(room).emit('msg', generateMsg(username, m))
        callback()
    })

    socket.on('sendLocation', (e, cb) => {
        const { room, username } = getUser(socket.id)
        io.to(room).emit('Locationmsg', generateLocMsg(username,`https://google.com/maps?q=${e.lat},${e.long}`))
        cb() // acknowledge callback
    })




    // Send msg when user left
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('msg', generateMsg('System',`${user.username} has left`))
            // Update the users list
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})




// View render

app.get('', (req, res) => {

    res.render('index', { // Web Directory **index doesnot required
        title: 'Chat App',
        name: 'Chakron Dechkrut'
    })

})

app.get('/chat', (req, res) => {

    res.render('chat', { // Web Directory **index doesnot required
        title: 'Chat App',
        name: 'Chakron Dechkrut'
    })

})

app.get('*', (req, res) => {

    res.render('404page', {
        title: '404 Page',
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)

})


