const devices = []

const addDevice = ({ id, username }) => {

    // Check for exsiting user
    const existingDevice = devices.find((dev) => {
        return dev.username == username
    })

    // Validate username
    if (existingDevice) {
        const S_device = getDeviceByName(username)
        S_device.id = id
        return S_device
    }

    if (!existingDevice) {
    // Store device
    const stat = {}
    const S_device = { id, username, stat }
    devices.push(S_device)
    return S_device
    }

}

const removeDevice = (id) => {
    const index = devices.findIndex((dev) => dev.id == id)

    if (index != -1) {
        return devices.splice(index, 1)[0]
    }
}

const getDevice = (id) => {

    const found = devices.find((dev) => dev.id == id)
    if (!found) {
        return console.log('getDevice, id not found')
    }    
    return found
}

const getDeviceByName = (username) => {

    const found = devices.find((dev) => dev.username == username)
    if (!found) {
        return console.log('getDeviceByName, username not found')
    }  
    return found
}

const addStat = ({ id, username, stat }) => {

    const device = getDevice(id)
    device.stat = stat

    console.log('addStat: ', device)
}

module.exports = {
    addDevice,
    removeDevice,
    getDevice,
    getDeviceByName,
    addStat
}