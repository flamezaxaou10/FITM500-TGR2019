var express = require('express')
var router = express.Router()

var beaconData = require('../models/beaconData.js')

router.get('/getSanam', (req, res, next) => {
  let hours = req.query.hours
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
    let moment = require('moment')
    let date = new Date(Date.now())
    let date7 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0)
    console.log('date', moment(date7))
    let dateSuccess = moment(date7).format('x') - (3600 * 1000)
    payload = payload.filter(data => moment(new Date(data.timestamp)).format('x') - dateSuccess < (3600 * 1000))
    payload.forEach((value) => {
      let timestamp = moment(new Date(value.timestamp)).format('x')
      if (timestamp - dateSuccess >= 0) {
        arrPayload[checkTime] = arrPayload[checkTime] ? arrPayload[checkTime] + 1 : 1
      } else {
        checkTime++
        dateSuccess = dateSuccess - (3600 * 1000)
      }
    })
    // payload.forEach((value) => {
    //   let timestamp = new Date(value.timestamp).getTime()
    //   // console.log(value.timestamp)
    //   if (moment(timestamp).format('x') >= parseInt(dateSuccess)) {
    //     if (value.pIn > 0) {
    //       arrPayload[checkTime]++
    //     } 
    //   } else {
    //     checkTime++
    //     if (value.pIn > 0) {
    //       arrPayload[checkTime]++
    //     }
    //     dateSuccess = moment(date7).subtract({
    //       minutes: parseInt(moment(date7).format('mm')),
    //       seconds: parseInt(moment(date7).format('ss'))
    //     })
    //     dateSuccess = dateSuccess.subtract(checkTime+1, 'hours').format('x')
    //   }
    // })
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

module.exports = router