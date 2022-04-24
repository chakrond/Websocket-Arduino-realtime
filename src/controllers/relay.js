const path = require("path")
const { getDeviceByName, addStat } = require('../utils/devices')

const relay = async (req, res) => {

    const device = getDeviceByName(req.params.device)
    console.log('device: ', device)

    // Check stat and add stat in device
    if (Object.keys(device.stat).length == 0 && device.stat.constructor == Object) {

        addStat({
            id: device.id,
            username: device.username,
            stat: {
                relay1: 'false',
                relay2: 'false'
            }
        })

        console.log("Object is empty, Adding Stat in Device")

    } else {
        console.log("Object is not empty")
    }

    return res.sendFile(path.join(__dirname, '../../templates/views/relay.html'))
}



module.exports = {
    getRelay: relay
}