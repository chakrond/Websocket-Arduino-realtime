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


