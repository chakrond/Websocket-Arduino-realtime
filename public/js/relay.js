const socket = io()

// ------------------------------------------------------------
// Get device info
// ------------------------------------------------------------
// Querey string
const { devname } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // get querey string

socket.on('joined', (dev) => {

    // request device
    socket.emit('reqDevice', { ClientId: dev.id, username: devname })
})

// get form element
const swtichRelay1 = document.getElementById('switchCheck-Relay-1')
const swtichRelay2 = document.getElementById('switchCheck-Relay-2')

// get device stat
socket.on('deviceInfo', (dev) => {

    console.log('deviceInfo: ', dev)

    // Relay 1
    // check the latest stat of relay
    if (dev.stat['relay1'] == 'true') {
        swtichRelay1.setAttribute('checked', 'checked')
    } else {
        swtichRelay1.removeAttribute('checked')
    }

    // Relay 2
    // check the latest stat of relay
    if (dev.stat['relay2'] == 'true') {
        swtichRelay2.setAttribute('checked', 'checked')
    } else {
        swtichRelay2.removeAttribute('checked')
    }

})


// ------------------------------------------------------------
// Relay 1
// ------------------------------------------------------------

swtichRelay1.addEventListener('change', (e) => {

    e.preventDefault() // prevent page refresh

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: devname,
            relay1: 'true'

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay1: 'false'

        })
    }

    // console.log('Relay1 Command was delivered')

})

// ------------------------------------------------------------
// Relay 2
// ------------------------------------------------------------

swtichRelay2.addEventListener('change', (e) => {

    e.preventDefault()

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: devname,
            relay2: 'true'

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay2: 'false'

        })
    }

    // console.log('Relay2 Command was delivered')

})