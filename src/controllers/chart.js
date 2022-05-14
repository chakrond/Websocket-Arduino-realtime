const path = require("path")

const chart = async (req, res) => {

    try {

        

        return res.sendFile(path.join(__dirname, '../../templates/views/chart.html'))

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        })
    }
}


module.exports = {
    getChart: chart
}