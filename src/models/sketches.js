const mongoose = require('mongoose')

const sketchSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    version: {
        type: String,
        required: true,
        trim: true
    },

    sketch: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Sketch = mongoose.model('sketches', sketchSchema)

module.exports = Sketch