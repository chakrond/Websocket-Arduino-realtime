const express = require("express")
const router = express.Router()
const homeController = require("../controllers/home")
const uploadController = require("../controllers/upload")

let routes = app => {

  router.get("/home", homeController.getHome)
  router.post("/upload", uploadController.uploadFiles)
  router.get("/Listfiles", uploadController.getListFiles)
  router.get("/Listfiles/:name", uploadController.getListSpcFiles)
  router.get("/update/:board/:name", uploadController.update)
  return app.use("/", router)
}

module.exports = routes