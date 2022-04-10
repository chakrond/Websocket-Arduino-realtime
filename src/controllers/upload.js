const upload = require('../middleware/upload')
const dbConfig = require('../db/mongoose')
const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket
const url = dbConfig.url
const baseUrl = 'http://localhost:8080/files/'
const mongoClient = new MongoClient(url)


const uploadFiles = async (req, res) => {

  try {

    await upload(req, res)
    console.log(req.file)
    if (req.file == undefined) {
      return res.send({
        message: 'You must select a file.',
      })
    }
    
    return res.send({
      message: 'File has been uploaded.',
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
    const collection = database.collection(dbConfig.sketchBucket + '.files')
    const cursor = collection.find({ })

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: 'No files found!',
      })
    }

    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
        length: doc.length
      })
    })

    return res.status(200).send(fileInfos)

  } catch (error) {
    return res.status(500).send({
      message: error.message,
    })
  }

}


const getListSpcFiles = async (req, res) => {

  try {

    await mongoClient.connect()
    const database = mongoClient.db(dbConfig.database)
    const collection = database.collection(dbConfig.sketchBucket + '.files')
    const regE = new RegExp(`^${req.params.name}`)
    // console.log(`regE: ${regE}`)
    const cursor = collection.find({ filename: regE }).sort({ uploadDate : true })

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: 'No files found!',
      })
    }

    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
        length: doc.length
      })
    })

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
    const collection = database.collection(dbConfig.sketchBucket + '.files')

    // Find files
    const regE = new RegExp('^esp8266-OTA-Cloud-ver')
    const cursor = collection.find({ filename: regE }).sort({ uploadDate : true })

    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
        length: doc.length
      })
    })

    let text = req.params.name
    let position = text.search("ver")
    let paramVer = text.substr(position+3, 3)


    const fileContLen = fileInfos[0].length
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

    downloadStream.on('data', function (data) {
      return res.status(200).write(data)
    })

    downloadStream.on('error', function (err) {
      return res.status(404).send({ message: 'Cannot download the file' })
    })

    downloadStream.on('end', () => {
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
  getListSpcFiles,
  download,
}