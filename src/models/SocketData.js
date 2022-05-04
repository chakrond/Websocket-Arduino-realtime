const mongoose = require('mongoose')
const converTime = require('../utils/convertTime')

const SocketDataSchema = new mongoose.Schema({

    // Option 1
    recDate: {
        type: Date,
        trim: true
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
        type: String,
        require: true,
    },
}, {
    timestamps: true
})


const SocketData = mongoose.model('SocketData', SocketDataSchema)

module.exports = SocketData