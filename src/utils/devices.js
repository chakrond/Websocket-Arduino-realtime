const devices = []

const addDevice = ({ username }) => {

    // Check for exsiting user
    const existingDevice = devices.find((dev) => {
        return dev.username == username
    })

    // Validate username
    // if (existingDevice) {
    //     const { username } = getDevice(username)
    //     removeDevice(username)
    // }

    if (!existingDevice) {

        // Store device
        const stat = {}
        const S_device = { username, stat }
        devices.push(S_device)
        return S_device
    }

}

const removeDevice = (username) => {
    const index = devices.findIndex((dev) => dev.username == username)

    if (index != -1) {
        return devices.splice(index, 1)[0]
    }
}

const getDevice = (username) => {
    return devices.find((dev) => dev.username == username)
}

const addStat = ({ username, stat }) => {

    const device = getDevice(username)
    device.push(stat)
}

module.exports = {
    addDevice,
    removeDevice,
    getDevice,
    addStat
}