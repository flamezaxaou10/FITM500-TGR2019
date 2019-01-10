var mongoose = require('mongoose')
var beaconData = new mongoose.Schema({
    pIn: { type: Number, required: true },
    pOut: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('beaconData', beaconData)