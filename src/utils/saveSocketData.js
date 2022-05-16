const SocketData = require('../models/SocketData')
const converTime = require('./convertTime')

const saveDataToCollection = async ({ data, username }) => {

    try {

        const VData = await SocketData.findOne({ recDate: converTime(7), owner: username })

        if (VData) {
            VData.dataArray = await VData.dataArray.concat({
                recTime: new Date(Date.now() + (7 * 60 * 60 * 1000)), // use defalut in model record will create only once, no update
                dsTemp_IN: data.dsTemp_IN,
                DHT21_IN: data.DHT21_IN,
                dsTemp_Tank: data.dsTemp_Tank
            })
            await VData.save()
            return console.log('Save data to colleciton successfully!')
        }

        const NewData = new SocketData({
            recDate: converTime(7),
            dataArray: [{
                recTime: new Date(Date.now() + (7 * 60 * 60 * 1000)),
                dsTemp_IN: data.dsTemp_IN,
                DHT21_IN: data.DHT21_IN,
                dsTemp_Tank: data.dsTemp_Tank
            }],
            owner: username
        })

        await NewData.save()
        console.log('Create data object successfully!')

    } catch (e) {
        console.log(e)
    }

}


const getData = async (query) => {

    try {

        if (query.by) {

            const data = await SocketData.find({ recDate: new Date(query.by), owner: query.devname })

            if (!data) {
                return console.log('ChartData, date not found')
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            return obj
        }

        if (query.range) {

            const parts = query.range.split(':')

            const data = await SocketData.find({ recDate: { $gte: new Date(parts[0]), $lte: new Date(parts[1]) }, owner: query.devname })

            if (!data) {
                return console.log('ChartData, date range not found')
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            return obj
        }

        if (query.month) {

            const parts = query.month

            const data = await SocketData.find({ recDate: { $gte: new Date(parts + '-01'), $lte: new Date(parts + '-31') }, owner: query.devname })

            if (!data) {
                return console.log('ChartData, month not found')
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            return obj
        }

        if (query.year) {

            const parts = query.year

            const data = await SocketData.find({ recDate: { $gte: new Date(parts + '-01-01'), $lte: new Date(parts + '-12-31') }, owner: query.devname })

            if (!data) {
                return console.log('ChartData, year not found')
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            return obj
        }

    } catch (e) {
        console.log(e)
    }

}



module.exports = {
    saveDataToCollection,
    getData
}