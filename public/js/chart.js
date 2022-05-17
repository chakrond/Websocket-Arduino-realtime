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
var Linedata

socket.on('ChartData', async (data) => {

    console.log('ChartData: ', data)

    const labels = data.recTime

    Linedata = {
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
    await appenCheckBox()
})


const appenCheckBox = async () => {

    // Map data
    // Create nested array
    const combArray = []
    const dataLabel = {}

    Linedata.datasets.flatMap((a) => {
        return combArray.push(a['label'])
    })

    Object.assign(dataLabel, { ['label']: combArray })
    console.log('dataLabel: ', dataLabel)

    // get <div>
    const inlineCB = document.getElementById('inlineCB')

    for (let i = 0; i < dataLabel.label.length; i++) {

        // creating checkbox element
        var checkbox = document.createElement('input')

        // Assigning the attributes
        // to created checkbox
        checkbox.type = 'checkbox'
        checkbox.name = dataLabel.label[i]
        // checkbox.value = 'value'
        checkbox.id = dataLabel.label[i]
        checkbox.checked = true

        // creating label for checkbox
        var label = document.createElement('label')

        // assigning attributes for 
        // the created label tag 
        label.htmlFor = dataLabel.label[i]

        // appending the created text to 
        // the created label tag 
        label.appendChild(document.createTextNode(dataLabel.label[i]))

        // appending the checkbox
        // and label to div
        inlineCB.appendChild(checkbox)
        inlineCB.appendChild(label)
    }
}


