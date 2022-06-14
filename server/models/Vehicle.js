const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    make: {
        type: String,
    },
    model: {
        type: String,
    },
    year: {
        type: String,
    },
    condition: {
        type: String,
        enum: ['New', 'Used']
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    }
})

module.exports = mongoose.model('Vehicle', VehicleSchema)