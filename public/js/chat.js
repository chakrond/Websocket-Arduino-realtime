const socket = io()

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // get quirey string

// Msg elements
const msgForm = document.querySelector('#msgform')
const msgFormInput = msgForm.querySelector('input')
const msgFormBtn = msgForm.querySelector('button')

msgForm.addEventListener('submit', (e) => {

    e.preventDefault()

    // disabled button when after msg sent
    msgFormBtn.setAttribute('disabled', 'disabled')

    const msgInput = e.target.elements.msg_1.value

    // Emit event sendMsg to server
    socket.emit('sendMsg', msgInput, (error) => {

        // enable button
        msgFormBtn.removeAttribute('disabled')

        // clear msg
        msgFormInput.value = ''
        msgFormInput.focus()


        if (error) {
            return console.log(error)
        }

        console.log('The message was delivered')
    })
})


// Msg Listener elements
const msg_s = document.querySelector('#msg_s') // div
// Msg Listener template
const msg_sTemplate = document.querySelector('#msg_stemplate').innerHTML

// Listen event msg from server
socket.on('msg', (in_msg) => {
    console.log(in_msg.text)

    const html = Mustache.render(msg_sTemplate, {
        username: in_msg.username,
        msg_M: in_msg.text,
        createdAt_M: moment(in_msg.createdAt).format('h:mm a')
    })

    msg_s.insertAdjacentHTML('beforeend', html) // insert html to <div id="msg_s">
})


// Location elements
const locationBtn = document.querySelector('#send-location')
const msg_LocTemplate = document.querySelector('#msg_Locationtemplate').innerHTML


// Send Location
locationBtn.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // disabled button
    locationBtn.setAttribute('disabled', 'disabled')


    navigator.geolocation.getCurrentPosition((position) => {

        const { latitude, longitude } = position.coords
        const timestamp = position.timestamp

        // Emit event to server
        socket.emit('sendLocation', {
            timestamp: timestamp,
            lat: latitude,
            long: longitude
        }, () => { // acknowledge callback
            console.log('Location shared')
            locationBtn.removeAttribute('disabled')
        })
    })
})


// Listen to locationmsg
socket.on('Locationmsg', (in_msg) => {
    console.log(in_msg)

    const html = Mustache.render(msg_LocTemplate, {
        username: in_msg.username,
        msg_Location: in_msg.url,
        createdAt_Loc: moment(in_msg.createdAt).format('h:mm a')

    })

    msg_s.insertAdjacentHTML('beforeend', html)
})

// Sidebar
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const sidebar = document.querySelector('#sidebar')

// Listen to the roomData
socket.on('roomData', ({room, users}) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})


// Redirect to homepage when client get error
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href ='/'
    }
})




