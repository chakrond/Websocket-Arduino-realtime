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