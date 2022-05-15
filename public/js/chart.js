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
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            yAxisID: 'y',
        },
        {
            label: 'dsTemp_IN',
            data: ChartData.dsTemp_IN,
            borderColor: Utils.CHART_COLORS.blue,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            yAxisID: 'y1',
        }
    ]
}

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - Multi Axis'
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',

                // grid line settings
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
        }
    },
}

const myChart = new Chart(
    document.getElementById('myChart'),
    config
)