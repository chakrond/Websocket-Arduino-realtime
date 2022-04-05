const path = require("path");
const home = (req, res) => {
  return res.sendFile(path.join('../templates/views/index.html'))
}
module.exports = {
  getHome: home
}