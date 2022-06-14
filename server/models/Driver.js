const mongoose = require('mongoose')

const DriverSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: String,
    }
})

module.exports = mongoose.model('Driver', DriverSchema)