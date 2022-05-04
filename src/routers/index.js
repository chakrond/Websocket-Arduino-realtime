const express = require("express")
const router = express.Router()
const homeController = require("../controllers/home")
const uploadController = require("../controllers/upload")
const relayController = require("../controllers/relay")

let routes = app => {

  // Upload & Download Skecth
  router.get("/home", homeController.getHome)
  router.post("/upload", uploadController.uploadFiles)
  router.get("/Listfiles", uploadController.getListFiles)
  router.get("/Listfiles/:name", uploadController.getListSpcFiles)
  router.get("/update/:board", uploadController.update)
  router.get("/download/:board/:name", uploadController.download)

  // Relay control
  router.get("/relay", relayController.getRelay)

  // Board control page
  

  return app.use("/", router)
}

module.exports = routes