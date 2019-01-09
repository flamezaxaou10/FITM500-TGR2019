var express = require('express')
var router = express.Router()

var user = require('../models/temperature.js')

router.get('/showData', (req, res, next) => {
  user.find().exec(function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.post('/addData', (req, res, next) => {
  user.create(req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(201)
  })
})

router.post('/receiveData', (req, res, next) => {
  user.create(req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(201)
  })
})

router.put('/editData/:teamID', (req, res, next) => {
  user.findOneAndUpdate({ teamID: req.params.teamID }, req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.delete('/deleteData/:teamID', (req, res, next) => {
  user.findOneAndRemove({ teamID: req.params.teamID }, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

module.exports = router