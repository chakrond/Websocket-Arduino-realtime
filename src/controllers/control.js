const path = require("path")
const { getDeviceByName, addStat } = require('../utils/devices')

const control = async (req, res) => {

    try {

        const device = getDeviceByName(req.query.devname) // ?devname=
        // console.log('device: ', device)

        // Check stat and add stat in device
        if (Object.keys(device.stat).length == 0 && device.stat.constructor == Object) {

            console.log("Object is empty, Adding Stat in Device")

            addStat({
                id: device.id,
                username: device.username,
                stat: {
                    relay1: 'false',
                    relay2: 'false',
                    relay3: 'false',
                    relay4: 'false'
                }
            })

        } else {
            console.log("Object is not empty")
        }

        return res.sendFile(path.join(__dirname, '../../templates/views/control.html'))

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        })
    }
}


module.exports = {
    getControl: control
}