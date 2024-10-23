const path = require("path")
const { getDeviceByName, addStat, addSettings } = require('../utils/devices')

const soundMonitor = async (req, res) => {

    try {

        // Serve HTML file
        return res.sendFile(path.join(__dirname, '../../templates/views/soundMonitor.html'))

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        })
    }
}


module.exports = {
    getSoundMonitor: soundMonitor
}