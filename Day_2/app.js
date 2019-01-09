const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')

//Import File
var user = require('./routes/user')

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost/tgr2019', { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() => console.log('MongoDB Connection Succesful'))
  .catch((err) => console.error(err))


app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// Route
app.use('/user', user)

app.get('/', (req, res) => {
  res.status(200)
  res.send('RESTFul-API @FITM500-TGR2019')
})

let server = app.listen(port, () => {
  let port = server.address().port
  console.log('Start server at port ' + port + ' >> localhost:' + port)
})