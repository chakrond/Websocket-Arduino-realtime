const socket = io()

// ------------------------------------------------------------
// Relay 1
// ------------------------------------------------------------

// get form element
const swtichRelay1 = document.getElementById('switchCheck-Relay-1')

swtichRelay1.addEventListener('change', (e) => {

    e.preventDefault() // prevent page refresh

    swtichRelay1.setAttribute('checked', 'checked')

    if (e.target.checked) {
        
        socket.emit('event_relay', {

            username: "esp8266-5V2R-01",
            relay1: "true"

        }, (error) => {
            if (error) {
                return console.log(error)
            }
        })

    } else {

        socket.emit('event_relay', {

            username: "esp8266-5V2R-01",
            relay1: "false"

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