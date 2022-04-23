const path = require("path")

const relay = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../templates/views/relay.html'))
}

module.exports = {
    getRelay: relay
}