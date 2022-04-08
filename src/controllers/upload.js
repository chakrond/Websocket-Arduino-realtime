const upload = require("../middleware/upload")
const dbConfig = require("../db/mongoose")
const MongoClient = require("mongodb").MongoClient
const GridFSBucket = require("mongodb").GridFSBucket
const url = dbConfig.url
const baseUrl = "http://localhost:8080/files/"
const mongoClient = new MongoClient(url)


const uploadFiles = async (req, res) => {

  try {

    await upload(req, res)
    console.log(req.file)
    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      })
    }
    
    return res.send({
      message: "File has been uploaded.",
    })

  } catch (error) {
    console.log(error)
    return res.send({
      message: `Error when trying upload: ${error}`,
    })
  }

}


const getListFiles = async (req, res) => {

  try {

    await mongoClient.connect()
    const database = mongoClient.db(dbConfig.database)
    const collection = database.collection(dbConfig.sketchBucket + ".files")
    const cursor = collection.find({})

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      })
    }

    return res.status(200).send(fileInfos)

  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }

}


const download = async (req, res) => {

  try {

    await mongoClient.connect()
    const database = mongoClient.db(dbConfig.database)

    // Find file
    const collection = database.collection(dbConfig.sketchBucket + ".files")
    const cursor = collection.find({ filename: req.params.name })

    // let fileInfos = []
    // await cursor.forEach((doc) => {
    //   fileInfos.push({
    //     name: doc.filename,
    //     url: baseUrl + doc.filename,
    //     length: doc.length
    //   })
    // })

    // const fileContLen = fileInfos[0].length
    const fileContLen = cursor[0].length
    console.log(`fileContLen: ${fileContLen}`)

    // set header
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileContLen
    })

    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.sketchBucket,
    })
    let downloadStream = bucket.openDownloadStreamByName(req.params.name)

    downloadStream.on("data", function (data) {
      return res.status(200).write(data)
    })

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the file" })
    })

    downloadStream.on("end", () => {
      return res.end()
    })

  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }

}


module.exports = {
  uploadFiles,
  getListFiles,
  download,
}