const { uploadFilesMiddleware } = require('../middleware/upload') // get GridFsStorage from Middleware
const dbConfig = require('../db/mongoose')
const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket
const url = dbConfig.url
const baseUrl = 'http://localhost:8080/files/'
const mongoClient = new MongoClient(url)


const uploadFiles = async (req, res) => {

  try {

    await uploadFilesMiddleware(req, res)
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
    const cursor = collection.find({})

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
    const cursor = collection.find({ filename: regE }).sort({ uploadDate: -1 })

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


const update = async (req, res) => {

  try {

    await mongoClient.connect()
    const database = mongoClient.db(dbConfig.database)
    const collection = database.collection(dbConfig.sketchBucket + '.files')

    // Find files
    if (!req.query.name) {
      return res.status(200).send()
    }
    const regE = new RegExp(`^${req.params.board}-${req.query.name}-OTA-Cloud-ver`) // Filename format board-name-OTA-Cloud-ver1.0
    // const regE = new RegExp(`^${req.params.board}-OTA-Cloud-ver`)
    console.log(`Request Filename: ${regE}`)
    const cursor = collection.find({ filename: regE }).sort({ uploadDate: -1 })

    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
        length: doc.length
      })
    })

    // client request
    // let reqText = req.params.ver
    // console.log(`req.params.ver: ${req.params.ver}`)
    // let reqPosition = reqText.search("ver") // ver = 3
    // let reqVer = parseFloat(reqText.substr(reqPosition + 3, 3)) // plus 1.0 = 3
    // console.log(`reqVer: ${reqVer}`)

    let reqHeader
    let reqVer
    if (req.params.board == 'esp8266') {

      reqHeader = req.header('x-esp8266-version')
      reqVer = parseFloat(reqHeader)

    } else if (req.params.board == 'mkr1010') {

      reqHeader = req.header('x-mkr1010-version')
      reqVer = parseFloat(reqHeader)

    }
    console.log(`reqVer: ${reqVer}`)

    // server info
    let latestVerName = fileInfos[0].name
    console.log(`latestVerName: ${latestVerName}`)
    let servPosition = latestVerName.search("ver")
    let servVer = parseFloat(latestVerName.substr(servPosition + 3, 4))
    console.log(`servVer: ${servVer}`)

    // Version check
    if (reqVer >= servVer) {

      console.log('already on recent version!!')
      return res.status(304).send({
        message: 'already on recent version!!',
      })
    }

    console.log('Begin update...')

    // Serve the latest version of file
    // req.params.name = latestVerName
    const fileContLen = fileInfos[0].length // File Length
    // console.log(`fileContLen: ${fileContLen}`)

    // set header
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileContLen
    })

    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.sketchBucket,
    })

    // open stream
    let downloadStream = bucket.openDownloadStreamByName(latestVerName)

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


const download = async (req, res) => {

  try {

    await mongoClient.connect()
    const database = mongoClient.db(dbConfig.database)
    const collection = database.collection(dbConfig.sketchBucket + '.files')

    // Find files
    const cursor = collection.find({ filename: req.params.name })

    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
        length: doc.length
      })
    })

    // File Length
    const fileContLen = fileInfos[0].length
    // console.log(`fileContLen: ${fileContLen}`)

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
  update,
  download
}