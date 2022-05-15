const socket = io()

// ------------------------------------------------------------
// Get device info
// ------------------------------------------------------------
// Querey string
const query = Qs.parse(location.search, { ignoreQueryPrefix: true }) // get querey string

socket.on('joined', (dev) => {

    console.log('on joined: ', dev)

    // send request info
    socket.emit('reqChartData', { ClientId: dev.id, query })
})


var myChart
// var Ldata = {}
// var Lconfig = {}
socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)

    const labels = data.recTime

    const Linedata = {
        labels: labels,
        datasets: [
            {
                label: 'DHT21_IN',
                data: data.DHT21_IN,
                borderColor: '#4dc9f6',
                backgroundColor: '#4dc9f6',
            },
            {
                label: 'dsTemp_IN',
                data: data.dsTemp_IN,
                borderColor: '#58595b',
                backgroundColor: '#58595b',
            }
        ]
    }

    const config = {
        type: 'line',
        data: Linedata,
        options: {}
    }

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    )
})
