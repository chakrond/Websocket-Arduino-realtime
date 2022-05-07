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

module.exports = {
    saveDataToCollection
}