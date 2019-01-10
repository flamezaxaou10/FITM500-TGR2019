var mongoose = require('mongoose')
const moment = require('moment-timezone')
const dateThailand = moment.tz(Date.now(), "Asia/Bangkok")
var sensorData = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number , required: true },
    pIn: { type: Number, required: true },
    pOut: { type: Number, required: true },
    timestamp: { type: Date, default: dateThailand.format() }
})

module.exports = mongoose.model('sensorData', sensorData)