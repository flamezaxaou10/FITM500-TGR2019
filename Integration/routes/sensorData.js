var express = require('express')
var router = express.Router()

var sensorData = require('../models/sensorData.js')

router.get('/', (req, res, next) => {
  sensorData.find().exec(function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.post('/', (req, res, next) => {
  console.log(req.body)
  sensorData.create(req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(201)
  })
})

router.get('/getCurrentData', async (req, res, next) => {
  var people = {}
  await sensorData.find({
    timestamp: {
      $gte: new Date((Date.now() - (parseInt(1) * 60 * 60 * 1000)))
    }
  }).exec(function (err, payload) {
    let pIn = payload.reduce((result, value) => result + value.pIn, 0)
    let pOut = payload.reduce((result, value) => result + value.pOut, 0)
    people = {
      pIn: pIn,
      pOut: pOut,
      amountPeople: pIn - pOut
    }
  })
  sensorData.find().limit(1).sort('-timestamp').exec(function (err, payload) {
    if (err) return next(err)
    res.status(200)
    res.json({
      temperature: payload[0].temperature,
      humidity: payload[0].humidity,
      people: people
    })
  })
})

module.exports = router