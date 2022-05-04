const path = require("path")
const { getDeviceByName, addStat, addSettings } = require('../utils/devices')

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
                    relay4: 'false',
                    relay5: 'false'
                }
            })

        } else {
            console.log("Object is not empty")
        }

        
        // Check settings and add settings in device
        if (Object.keys(device.settings).length == 0 && device.settings.constructor == Object) {

            console.log("Object is empty, Adding Settings in Device")

            addSettings({
                id: device.id,
                username: device.username,
                settings: {
                    trigTemp_FAN: "",
                    trigTemp_COOLING: "",
                    trigTemp_FOG: "",
                    trigHumid_FOG: "",
                    cutTemp_FAN: "",
                    cutTemp_COOLING: "",
                    cutTemp_FOG: "",
                    cutHumid_FOG: "",
                    Timer_FAN: ""
                }
            })

        } else {
            console.log("Object is not empty")
        }

        // Serve HTML file
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