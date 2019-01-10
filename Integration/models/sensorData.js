var mongoose = require('mongoose')
var sensorData = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number , required: true },
    pIn: { type: Number, required: true },
    pOut: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('sensorData', sensorData)