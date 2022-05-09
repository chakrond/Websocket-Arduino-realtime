const socket = io()

// ------------------------------------------------------------
// Get device info
// ------------------------------------------------------------
// Querey string
const { devname } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // get querey string

socket.on('joined', (dev) => {

    // update relay stat
    socket.emit('event_control', { ClientId: dev.id, username: devname, reqRelayStats: 'true' })

    // update device settings
    socket.emit('event_control', { ClientId: dev.id, username: devname, reqSettings: 'true' })

    // request device
    socket.emit('reqDevice', { ClientId: dev.id, username: devname })
})

// get form element
const swtichManual = document.getElementById('switchCheck-Manual')
const swtichRelay1 = document.getElementById('switchCheck-Relay-1')
const swtichRelay2 = document.getElementById('switchCheck-Relay-2')
const swtichRelay3 = document.getElementById('switchCheck-Relay-3')
const swtichRelay4 = document.getElementById('switchCheck-Relay-4')
const swtichRelay5 = document.getElementById('switchCheck-Relay-5')

// get input values
const trigTemp_FAN = document.getElementById('trigTemp_FAN')
const trigTemp_COOLING = document.getElementById('trigTemp_COOLING')
const trigTemp_FOG = document.getElementById('trigTemp_FOG')
const cutTemp_FAN = document.getElementById('cutTemp_FAN')
const cutTemp_COOLING = document.getElementById('cutTemp_COOLING')
const cutTemp_FOG = document.getElementById('cutTemp_FOG')
const trigHumid_FOG = document.getElementById('trigHumid_FOG')
const cutHumid_FOG = document.getElementById('cutHumid_FOG')
const Timer_FAN = document.getElementById('Timer_FAN')

// get paragraph text
const sensorsReading_dsTemp = document.getElementById("sensorsReading_dsTemp")
const sensorsReading_dsTemp_IN = document.getElementById("sensorsReading_dsTemp_IN")
const sensorsReading_DHT21_Humid = document.getElementById("sensorsReading_DHT21_Humid")


// get device Info
socket.on('deviceInfo', (dev) => {

    console.log('deviceInfo: ', dev)

    const isManualMode = swtichManual.checked

    if (!isManualMode) {
        swtichRelay1.disabled = true
        swtichRelay2.disabled = true
        swtichRelay3.disabled = true
        swtichRelay4.disabled = true
        swtichRelay5.disabled = true
    } else {
        swtichRelay1.disabled = false
        swtichRelay2.disabled = false
        swtichRelay3.disabled = false
        swtichRelay4.disabled = false
        swtichRelay5.disabled = false
    }

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

    // Relay 3
    // check the latest stat of relay
    if (dev.stat['relay3'] == 'true') {
        swtichRelay3.setAttribute('checked', 'checked')
    } else {
        swtichRelay3.removeAttribute('checked')
    }

    // Relay 4
    // check the latest stat of relay
    if (dev.stat['relay4'] == 'true') {
        swtichRelay4.setAttribute('checked', 'checked')
    } else {
        swtichRelay4.removeAttribute('checked')
    }

    // Relay 5
    // check the latest stat of relay
    if (dev.stat['relay5'] == 'true') {
        swtichRelay5.setAttribute('checked', 'checked')
    } else {
        swtichRelay5.removeAttribute('checked')
    }


    // Update settings values inputs
    trigTemp_FAN.value = dev.settings['trigTemp_FAN']
    trigTemp_COOLING.value = dev.settings['trigTemp_COOLING']
    trigTemp_FOG.value = dev.settings['trigTemp_FOG']
    cutTemp_FAN.value = dev.settings['cutTemp_FAN']
    cutTemp_COOLING.value = dev.settings['cutTemp_COOLING']
    cutTemp_FOG.value = dev.settings['cutTemp_FOG']
    trigHumid_FOG.value = dev.settings['trigHumid_FOG']
    cutHumid_FOG.value = dev.settings['cutHumid_FOG']
    Timer_FAN.value = dev.settings['Timer_FAN']

    // Update sensors read
    sensorsReading_dsTemp.innerHTML = dev.sensors['dsTemp_Tank']
    sensorsReading_dsTemp_IN.innerHTML = dev.sensors['dsTemp_IN']
    sensorsReading_DHT21_Humid.innerHTML = dev.sensors['DHT21_IN']

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
            relay2: "true"

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay2: "false"

        })
    }

    // console.log('Relay2 Command was delivered')

})

// ------------------------------------------------------------
// Relay 3
// ------------------------------------------------------------

swtichRelay3.addEventListener('change', (e) => {

    e.preventDefault()

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: devname,
            relay3: "true"

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay3: "false"

        })
    }

    // console.log('Relay2 Command was delivered')

})

// ------------------------------------------------------------
// Relay 4
// ------------------------------------------------------------

swtichRelay4.addEventListener('change', (e) => {

    e.preventDefault()

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: devname,
            relay4: "true"

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay4: "false"

        })
    }

    // console.log('Relay2 Command was delivered')

})

// ------------------------------------------------------------
// Relay 5
// ------------------------------------------------------------

swtichRelay5.addEventListener('change', (e) => {

    e.preventDefault()

    if (e.target.checked) {

        socket.emit('event_relay', {

            username: devname,
            relay5: "true"

        })

    } else {

        socket.emit('event_relay', {

            username: devname,
            relay5: "false"

        })
    }

    // console.log('Relay2 Command was delivered')

})


