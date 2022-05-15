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

socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)

})

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
]

const data = {
    labels: labels,
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
    }]
}

const config = {
    type: 'line',
    data: data,
    options: {}
}

const myChart = new Chart(
    document.getElementById('myChart'),
    config
)