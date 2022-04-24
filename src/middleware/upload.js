const util = require("util")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const dbConfig = require("../db/mongoose")

var storage = new GridFsStorage({

    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true }, // connection options

    file: (req, file) => {

      // const match = ["image/png", "image/jpeg"]
      // if (match.indexOf(file.mimetype) === -1) {
      //   const filename = `${Date.now()}-chakron-${file.originalname}`
      //   return filename
      // }

      return {
        bucketName: dbConfig.sketchBucket,
        filename: file.originalname
      }
      
    }
  })

  var uploadFiles = multer({ storage: storage }).single("file")
  var uploadFilesMiddleware = util.promisify(uploadFiles)


  module.exports = {
    uploadFilesMiddleware
  }