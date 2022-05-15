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

let ChartData;
socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)
    ChartData = data

})

const labels = ChartData.recTime

const data = {
    labels: labels,
    datasets: [
        {
            label: 'DHT21_IN',
            data: ChartData.DHT21_IN,
            borderColor: '#4dc9f6',
            backgroundColor: '#4dc9f6',
        },
        {
            label: 'dsTemp_IN',
            data: ChartData.dsTemp_IN,
            borderColor: '#58595b',
            backgroundColor: '#58595b',
        }
    ]
}

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Line Chart'
            }
        }
    },
}

const myChart = new Chart(
    document.getElementById('myChart'),
    config
)