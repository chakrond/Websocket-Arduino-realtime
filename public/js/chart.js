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

let getChartData;
socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)
    getChartData = data


})

console.log('getChartData: ', getChartData)
const labels = getChartData.recTime

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