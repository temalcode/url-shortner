
const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

let urlSchema = new mongoose.Schema({

    fullUrl: {
        type: String,
        required: true
    },
    short: {
        type: String,
        default: nanoid()
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})


module.exports = mongoose.model('urls', urlSchema)