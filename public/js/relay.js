const socket = io()

// ------------------------------------------------------------
// Get device info
// ------------------------------------------------------------

socket.on('joined', (dev, callback) => {

    const { id, username, address } = dev

    // request device
    socket.emit('reqDevice', {

        id: id,

    }, (error) => {
        if (error) {
            return console.log(error)
        }
    })

    callback()
})

// get device stat
socket.on('deviceStat', (device, callback) => {

    console.log('deviceStat: ', device)

})



// ------------------------------------------------------------
// Relay 1
// ------------------------------------------------------------

// get form element
const swtichRelay1 = document.getElementById('switchCheck-Relay-1')

// // check the latest stat of relay
// if (device.stat.relay1 == 'true') {

//     swtichRelay1.setAttribute('checked', 'checked')
// } else {

//     swtichRelay1.removeAttribute('checked')
// }

swtichRelay1.addEventListener('change', (e) => {

    e.preventDefault() // prevent page refresh

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: deviceUsername,
            relay1: 'true'

        }, (error) => {
            if (error) {
                return console.log(error)
            }
        })

    } else {

        socket.emit('event_relay', {

            username: deviceUsername,
            relay1: 'false'

        }, (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }

    console.log('Relay1 Command was delivered')

})

// ------------------------------------------------------------
// Relay 2
// ------------------------------------------------------------

// get form element
const swtichRelay2 = document.getElementById('switchCheck-Relay-2')

swtichRelay2.addEventListener('change', (e) => {

    e.preventDefault()

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: "esp8266-5V2R-01",
            relay2: "true"

        }, (error) => {
            if (error) {
                return console.log(error)
            }
        })

    } else {

        socket.emit('event_relay', {

            username: "esp8266-5V2R-01",
            relay2: "false"

        }, (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }

    console.log('Relay2 Command was delivered')

})