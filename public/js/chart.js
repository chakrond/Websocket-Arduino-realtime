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

var getChartData = {}
socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)
    Object.assign(getChartData, data)

})

const labels = getChartData.recTime
console.log('getChartData: ', getChartData)
console.log('recTime: ', getChartData.recTime)
console.log('DHT21_IN: ', getChartData.DHT21_IN)
console.log('dsTemp_IN: ', getChartData.dsTemp_IN)

const data = {
    labels: labels,
    datasets: [
        {
            label: 'DHT21_IN',
            data: getChartData.DHT21_IN,
            borderColor: '#4dc9f6',
            backgroundColor: '#4dc9f6',
        },
        {
            label: 'dsTemp_IN',
            data: getChartData.dsTemp_IN,
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