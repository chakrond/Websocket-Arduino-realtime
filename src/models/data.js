const mongoose = require('mongoose')
const converTime = require('../utils/convertTime')

const dataSchema = new mongoose.Schema({

    // Option 1
    recDate: {
        type: Date,
        trim: true,
        default: converTime(0)
    },
    dataArray: [{
        // Option 1
        recTime: { // // use defalut in model record will create only once, no update
            type: Date,
            trim: true
        },
        Humidity: {
            type: Number,
            trim: true
        },
        Temperature: {
            type: Number,
            trim: true,
            set: n => n.toFixed(1)
        },

        // Option 2
        dsTemp_IN: {
            type: Number,
            trim: true
        },
        DHT21_IN: {
            type: Number,
            trim: true,
            set: n => n.toFixed(1)
        },
        dsTemp_Tank: {
            type: Number,
            trim: true,
            set: n => n.toFixed(1)
        }   
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users' // Create reference to 'users' schema
    },
}, {
    timestamps: true
})


// Data
// dataSchema.methods.storeDataArray = async function (recTime, Humidity, Temperature) {

//     const data = this
//     data.dataArray = data.dataArray.concat({
//         'recTime': recTime,
//         'Humidity': Humidity,
//         'Temperature': Temperature
//     })
//     await data.save()

//     return data

//     // return token
// }
//
dataSchema.methods.formatData = async function () {

    const data = this

    // Map data
    const example = data[0].dataArray[0]
    const datajson = JSON.parse(JSON.stringify(example))
    delete datajson._id
    const keyNames = Object.keys(datajson)

    // Create nested array
    const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));

    for (let i = 0; i < keyNames.length; i++) {

        data.flatMap((a) => {
            return a.dataArray.map((b) => {
                return combArray[i].push(b[keyNames[i]])
            })
        })
    }

    // splice insert keynames at index 0
    combArray.splice(0, 0, keyNames)

    return combArray
}


const Data = mongoose.model('data', dataSchema)

module.exports = Data