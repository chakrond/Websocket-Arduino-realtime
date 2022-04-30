const Data = require('../models/data')
const converTime = require('./convertTime')

const saveDataToCollection = ({ data, username }) => {

    try {

        const VData = await Data.findOne({ recDate: converTime(7), owner: username })

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

        const NewData = new Data({
            dataArray: [{
                recTime: new Date(Date.now() + (7 * 60 * 60 * 1000)),
                dsTemp_IN: data.dsTemp_IN,
                DHT21_IN: data.DHT21_IN,
                dsTemp_Tank: data.dsTemp_Tank
            }],
            owner: username
        })

        await NewData.save()

    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    saveDataToCollection
}