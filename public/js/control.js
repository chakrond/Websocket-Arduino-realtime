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
const swtichRelay6 = document.getElementById('switchCheck-Relay-6')

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

// svg relay status
const svgElement_Relay1 = document.getElementById('svg-relay-1')
const svgElement_Relay2 = document.getElementById('svg-relay-2')
const svgElement_Relay3 = document.getElementById('svg-relay-3')
const svgElement_Relay4 = document.getElementById('svg-relay-4')
const svgElement_Relay5 = document.getElementById('svg-relay-5')
const svgElement_Relay6 = document.getElementById('svg-relay-6')

// Switch Timer
const swtichTimer = document.getElementById('switchCheck-Manual-Timer')

// Forms
const settingsForm_1 = document.querySelector('#settingsForm-1')
const btn_save_1 = settingsForm_1.querySelector('button')
const settingsForm_2 = document.querySelector('#settingsForm-2')
const btn_save_2 = settingsForm_2.querySelector('button')
const timerForm = document.querySelector('#timerForm')
const btn_save_3 = timerForm.querySelector('button')

// Command Buttons
const btn_restart = document.getElementById('btn_restart')
const btn_update = document.getElementById('btn_update')

// Plot
const form_chart = document.getElementById('chart_query_form')
const ipt_chart_query = document.getElementById('chart_query')
const btn_plot = document.getElementById('btn_plot')
const rdo_day = document.getElementById('option_day')
const rdo_range = document.getElementById('option_range')
const rdo_month = document.getElementById('option_month')
const rdo_year = document.getElementById('option_year')



// get device Info
socket.on('deviceInfo', (dev) => {

    console.log('deviceInfo: ', dev)

    console.log('isManualMode: ', dev.mode['isManualMode'])
    if (dev.mode['isManualMode'] == 'true') {
        swtichManual.checked = true
        const dateTime = new Date(dev.mode['closeTime'])
        const hr = dateTime.getHours()
        const mm = dateTime.getMinutes()
        const dateString = `AUTO CLOSE AT ${hr}:${mm}`
        swtichTimer.innerHTML = dateString
    }

    if (swtichManual.checked == false) {
        swtichRelay1.disabled = true
        swtichRelay2.disabled = true
        swtichRelay3.disabled = true
        swtichRelay4.disabled = true
        swtichRelay5.disabled = true
        swtichRelay6.disabled = true
    } else {
        swtichRelay1.disabled = false
        swtichRelay2.disabled = false
        swtichRelay3.disabled = false
        swtichRelay4.disabled = false
        swtichRelay5.disabled = false
        swtichRelay6.disabled = false
    }

    // Relay 1
    // check the latest stat of relay
    if (dev.stat['relay1'] == 'true') {
        swtichRelay1.setAttribute('checked', 'checked')
        svgElement_Relay1.style.fill = 'green' // svg
    } else {
        swtichRelay1.removeAttribute('checked')
        svgElement_Relay1.style.fill = 'red' // svg
    }

    // Relay 2
    // check the latest stat of relay
    if (dev.stat['relay2'] == 'true') {
        swtichRelay2.setAttribute('checked', 'checked')
        svgElement_Relay2.style.fill = 'green' // svg
    } else {
        swtichRelay2.removeAttribute('checked')
        svgElement_Relay2.style.fill = 'red' // svg
    }

    // Relay 3
    // check the latest stat of relay
    if (dev.stat['relay3'] == 'true') {
        swtichRelay3.setAttribute('checked', 'checked')
        svgElement_Relay3.style.fill = 'green' // svg
    } else {
        swtichRelay3.removeAttribute('checked')
        svgElement_Relay3.style.fill = 'red' // svg
    }

    // Relay 4
    // check the latest stat of relay
    if (dev.stat['relay4'] == 'true') {
        swtichRelay4.setAttribute('checked', 'checked')
        svgElement_Relay4.style.fill = 'green' // svg
    } else {
        swtichRelay4.removeAttribute('checked')
        svgElement_Relay4.style.fill = 'red' // svg
    }

    // Relay 5
    // check the latest stat of relay
    if (dev.stat['relay5'] == 'true') {
        swtichRelay5.setAttribute('checked', 'checked')
        svgElement_Relay5.style.fill = 'green' // svg
    } else {
        swtichRelay5.removeAttribute('checked')
        svgElement_Relay5.style.fill = 'red' // svg
    }

    // Relay 6
    // check the latest stat of relay
    if (dev.stat['relay6'] == 'true') {
        swtichRelay6.setAttribute('checked', 'checked')
        svgElement_Relay6.style.fill = 'green' // svg
    } else {
        swtichRelay6.removeAttribute('checked')
        svgElement_Relay6.style.fill = 'red' // svg
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
    sensorsReading_dsTemp.innerHTML = parseFloat(dev.sensors['dsTemp_Tank']).toFixed(1)
    sensorsReading_dsTemp_IN.innerHTML = parseFloat(dev.sensors['dsTemp_IN']).toFixed(1)
    sensorsReading_DHT21_Humid.innerHTML = parseFloat(dev.sensors['DHT21_IN']).toFixed(1)

})

// ------------------------------------------------------------
// Form Save
// ------------------------------------------------------------
var settings_values_1 = {}
settingsForm_1.addEventListener('submit', (e) => {

    e.preventDefault()

    settingsForm_1.querySelectorAll("input").forEach(ele => settings_values_1[ele.name] = ele.value || "")
    btn_save_1.setAttribute('disabled', 'disabled')

    // Emit event sendMsg to server
    socket.emit('event_control', {

        username: devname,
        issetTempChange: 'true',
        ...settings_values_1

    })

    // enable button
    btn_save_1.removeAttribute('disabled')

    console.log('Send Settings: ', settings_values_1)
})


var settings_values_2 = {}
settingsForm_2.addEventListener('submit', (e) => {

    e.preventDefault()

    settingsForm_2.querySelectorAll("input").forEach(ele => settings_values_2[ele.name] = ele.value || "")
    btn_save_2.setAttribute('disabled', 'disabled')

    // Emit event sendMsg to server
    socket.emit('event_control', {

        username: devname,
        issetHumidChange: 'true',
        ...settings_values_2

    })

    // enable button
    btn_save_2.removeAttribute('disabled')

    console.log('Send Settings: ', settings_values_2)
})


var settings_timerForm = {}
timerForm.addEventListener('submit', (e) => {

    e.preventDefault()

    timerForm.querySelectorAll("input").forEach(ele => settings_timerForm[ele.name] = ele.value || "")
    btn_save_3.setAttribute('disabled', 'disabled')

    // Emit event sendMsg to server
    socket.emit('event_control', {

        username: devname,
        isFSsetTimerChange: 'true',
        ...settings_timerForm

    })

    // enable button
    btn_save_3.removeAttribute('disabled')

    console.log('Send Settings: ', settings_timerForm)
})


// ------------------------------------------------------------
// Manual Mode
// ------------------------------------------------------------
swtichManual.addEventListener('change', (e) => {

    e.preventDefault() // prevent page refresh

    if (e.target.checked) {

        swtichRelay1.disabled = false
        swtichRelay2.disabled = false
        swtichRelay3.disabled = false
        swtichRelay4.disabled = false
        swtichRelay5.disabled = false
        swtichRelay6.disabled = false

        socket.emit('event_control', {

            username: devname,
            isManualMode: 'true',
            closeTime: new Date(Date.now() + (1 * 60 * 60 * 1000))
        })
        console.log('Command, Manual Mode: ON')

    } else {

        swtichRelay1.disabled = true
        swtichRelay2.disabled = true
        swtichRelay3.disabled = true
        swtichRelay4.disabled = true
        swtichRelay5.disabled = true
        swtichRelay6.disabled = true

        socket.emit('event_control', {

            username: devname,
            isManualMode: 'false',
        })
        console.log('Command, Manual Mode: OFF')
    }
})

// ------------------------------------------------------------
// Commands
// ------------------------------------------------------------
btn_restart.addEventListener('click', () => {

    // disabled button
    btn_restart.setAttribute('disabled', 'disabled')

    // enable button
    btn_restart.removeAttribute('disabled')

    console.log('Command, Plot: ', devname)
})

btn_update.addEventListener('click', () => {

    // disabled button
    btn_update.setAttribute('disabled', 'disabled')

    socket.emit('event_control', {

        username: devname,
        updateSketch: 'true',
    })

    // enable button
    btn_update.removeAttribute('disabled')

    console.log('Command, Update Board: ', devname)
})


// ------------------------------------------------------------
// Plot
// ------------------------------------------------------------
form_chart.addEventListener('submit', (e) => {

    // disabled button
    btn_plot.setAttribute('disabled', 'disabled')

    // check radio attribute
    var stringURL
    if (rdo_day.checked == true) {
        stringURL = 'by'
    }
    if (rdo_range.checked == true) {
        stringURL = 'range'
    }
    if (rdo_month.checked == true) {
        stringURL = 'month'
    }
    if (rdo_year.checked == true) {
        stringURL = 'year'
    }

    const inputValue = ipt_chart_query.value

    window.open(`/chart?devname=${devname}&${stringURL}=${inputValue}`)

    // enable button
    btn_plot.removeAttribute('disabled')

    e.preventDefault()

    console.log('Command, Plot: ', `${stringURL}, ${inputValue}`)
})



// ------------------------------------------------------------
// Relay 1
// ------------------------------------------------------------

swtichRelay1.addEventListener('change', (e) => {

    e.preventDefault() // prevent page refresh

    // svg
    svgElement_Relay1.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay1: 'true'

        })
        console.log('Command, Relay 1 - FAN 1: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay1: 'false'

        })
        console.log('Command, Relay 1 - FAN 1: OFF')
    }
})

// ------------------------------------------------------------
// Relay 2
// ------------------------------------------------------------

swtichRelay2.addEventListener('change', (e) => {

    e.preventDefault()

    // svg
    svgElement_Relay2.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay2: "true"

        })
        console.log('Command, Relay 2 - FAN 2: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay2: "false"

        })
        console.log('Command, Relay 2 - FAN 2: OFF')
    }
})

// ------------------------------------------------------------
// Relay 3
// ------------------------------------------------------------

swtichRelay3.addEventListener('change', (e) => {

    e.preventDefault()

    // svg
    svgElement_Relay3.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay3: "true"

        })
        console.log('Command, Relay 3 - FAN 3: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay3: "false"

        })
        console.log('Command, Relay 3 - FAN 3: OFF')
    }
})

// ------------------------------------------------------------
// Relay 4
// ------------------------------------------------------------

swtichRelay4.addEventListener('change', (e) => {

    e.preventDefault()

    // svg
    svgElement_Relay4.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay4: "true"

        })
        console.log('Command, Relay 4 - COOLING: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay4: "false"

        })
        console.log('Command, Relay 4 - COOLING: OFF')
    }
})

// ------------------------------------------------------------
// Relay 5
// ------------------------------------------------------------

swtichRelay5.addEventListener('change', (e) => {

    e.preventDefault()

    // svg
    svgElement_Relay5.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay5: "true"

        })

        console.log('Command, Relay 5 - FOG: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay5: "false"

        })
        console.log('Command, Relay 5 - FOG: OFF')
    }
})

// ------------------------------------------------------------
// Relay 6
// ------------------------------------------------------------

swtichRelay6.addEventListener('change', (e) => {

    e.preventDefault()

    // svg
    svgElement_Relay6.style.fill = e.target.checked ? 'green' : 'red'

    if (e.target.checked) {

        socket.emit('event_control', {

            username: devname,
            relay6: "true"

        })

        console.log('Command, Relay 6 - PAD: ON')

    } else {

        socket.emit('event_control', {

            username: devname,
            relay6: "false"

        })
        console.log('Command, Relay 6 - PAD: OFF')
    }
})


