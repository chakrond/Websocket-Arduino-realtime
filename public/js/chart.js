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
socket.on('ChartData', (data) => {

    console.log('ChartData: ', data)

    const labels = data.recTime

    const Linedata = {
        labels: labels,
        datasets: [
            {
                label: 'Humidity_IN',
                data: data.DHT21_IN,
                borderColor: '#4dc9f6',
                backgroundColor: '#4dc9f6',
            },
            {
                label: 'Temperature_IN',
                data: data.dsTemp_IN,
                borderColor: '#f67019',
                backgroundColor: '#f67019',
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

    console.log('myChart: ', myChart)
})


var inlineCB = document.getElementById('inlineCB')

// creating checkbox element
var checkbox = document.createElement('input')

// Assigning the attributes
// to created checkbox
checkbox.type = 'checkbox'
checkbox.name = 'name'
checkbox.value = 'value'
checkbox.id = 'id'

// creating label for checkbox
var label = document.createElement('label');

// assigning attributes for 
// the created label tag 
label.htmlFor = 'id'

// appending the created text to 
// the created label tag 
label.appendChild(document.createTextNode('This is the label for checkbox.'))

// appending the checkbox
// and label to div
inlineCB.appendChild(checkbox)
inlineCB.appendChild(label)
