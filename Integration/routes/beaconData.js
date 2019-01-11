var express = require('express')
var router = express.Router()

var beaconData = require('../models/beaconData.js')
var read = require('../tensorflow/read')
let Tensorflow = require('../tensorflow/tensorflow_provider')
let moment = require('moment')

router.get('/getSanam', (req, res, next) => {
  let hours = req.query.hours
  let firstTime = 0
  beaconData.find().limit(1).sort('timestamp').exec(function (err, payload) {
    firstTime = moment(new Date(payload[0].timestamp)).format('x')
  })

  beaconData.find({
    timestamp: {
      $gte: new Date((Date.now() - (parseInt(hours) * 60 * 60 * 1000)))
    }
  }).sort('-timestamp').exec(function (err, payload) {
    if (err) {
      res.status(401)
      res.send({
        msg: 'bad values >> not value: hours'
      })
    }
    let arrPayload = []
    for (var i = 0; i < hours; i++) {
      arrPayload[i] = 0
    }
    let checkTime = 0
    let date = new Date(Date.now())
    let date7 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0)
    let dateSuccess = moment(date7).format('x') - (3600 * 1000)
    payload = payload.filter(data => moment(new Date(data.timestamp)).format('x') - dateSuccess < (3600 * 1000))
    payload.forEach((value) => {
      let timestamp = moment(new Date(value.timestamp)).format('x')
      if (timestamp < firstTime) {
        res.status(404)
        res.json({
          msg: 'not enough value.'
        })
      }
      if (timestamp - dateSuccess >= 0) {
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
      } else {
        checkTime++
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
        dateSuccess = dateSuccess - (3600 * 1000)
      }
    })
    res.json({
      "number_of_tourist": arrPayload
    })
    res.status(200)
  })
})

router.post('/putSanam', async (req, res, next) => {
  // convert Data to DB
  let payload = {
    pIn: (req.body.beacon.status === 'enter') ? 1 : 0,
    pOut: (req.body.beacon.status === 'leave') ? 1 : 0
  }
  await beaconData.create(payload, function (err, payload) {
    if (err) return next(err)
  })
  var amountPeople = 0
  beaconData.find().exec(function (err, payload) {
    let pIn = payload.reduce((result, value) => result + value.pIn, 0)
    let pOut = payload.reduce((result, value) => result + value.pOut, 0)
    amountPeople = pIn - pOut
    req.body.amountPeople = amountPeople
    res.json(req.body)
    res.status(201)
  })
})

router.get('/getAmountPeople', (req, res, next) => {
  var amountPeople = 0
  beaconData.find().exec(function (err, payload) {
    let pIn = payload.reduce((result, value) => result + value.pIn, 0)
    let pOut = payload.reduce((result, value) => result + value.pOut, 0)
    amountPeople = pIn - pOut
    req.body.amountPeople = amountPeople
    res.json(req.body)
    res.status(201)
  })
})

router.get('/getAll', (req, res, next) => {
  beaconData.find().exec(function (err, payload) {
    res.json(payload)
    res.status(200)
  })
})


router.get('/predict', (req, res, next) => {
  beaconData.find().sort('-timestamp').exec(function (err, payload) {
    let arrPayload = []
    for (var i = 0; i < payload.length; i++) {
      arrPayload[i] = 0
    }
    let checkTime = 0
    let moment = require('moment')
    let date = new Date(Date.now())
    let date7 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0)
    let dateSuccess = moment(date7).format('x') - (3600 * 1000)
    payload = payload.filter(data => moment(new Date(data.timestamp)).format('x') - dateSuccess < (3600 * 1000))
    payload.forEach((value) => {
      let timestamp = moment(new Date(value.timestamp)).format('x')
      if (timestamp - dateSuccess >= 0) {
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
      } else {
        checkTime++
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
        dateSuccess = dateSuccess - (3600 * 1000)
      }
    })

    async function main() {
      let data = await read(arrPayload)
      console.log('max --->', data.max)
      const tensorFlow = new Tensorflow(data, 12)
      // await tensorFlow.trainDataScaling()
      let result = await tensorFlow.predictDataScaling([
        [
          parseFloat(arrPayload[11]) / data.max,
          parseFloat(arrPayload[10]) / data.max,
          parseFloat(arrPayload[9]) / data.max,
          parseFloat(arrPayload[8]) / data.max,
          parseFloat(arrPayload[7]) / data.max,
          parseFloat(arrPayload[6]) / data.max,
          parseFloat(arrPayload[5]) / data.max,
          parseFloat(arrPayload[4]) / data.max,
          parseFloat(arrPayload[3]) / data.max,
          parseFloat(arrPayload[2]) / data.max,
          parseFloat(arrPayload[1]) / data.max,
          parseFloat(arrPayload[0]) / data.max
        ]
      ])
      res.status(200)
      res.json({
        number_of_tourist: result.result
      })
    }

    main();
  })
})

router.get('/train', (req, res, next) => {
  beaconData.find().sort('-timestamp').exec(async function (err, payload) {
    let arrPayload = []
    for (var i = 0; i < payload.length; i++) {
      arrPayload[i] = 0
    }
    let checkTime = 0
    let moment = require('moment')
    let date = new Date(Date.now())
    let date7 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0)
    console.log('date', moment(date7))
    let dateSuccess = moment(date7).format('x') - (3600 * 1000)
    payload = payload.filter(data => moment(new Date(data.timestamp)).format('x') - dateSuccess < (3600 * 1000))
    payload.forEach((value) => {
      let timestamp = moment(new Date(value.timestamp)).format('x')
      if (timestamp - dateSuccess >= 0) {
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
      } else {
        checkTime++
        if (value.pIn > 0)
          arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
        dateSuccess = dateSuccess - (3600 * 1000)
      }
    })

    async function main() {
      let data = await read(arrPayload)
      console.log('max --->', data.max)
      const tensorFlow = new Tensorflow(data, 12)
      await tensorFlow.trainDataScaling()
    }

    await main();
    res.send("Test Sucess")
  })
})


module.exports = router