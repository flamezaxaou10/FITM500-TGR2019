const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
var fs = require("fs")

app.use(bodyParser.json({ limit: '50mb', extended: true }))

app.get('/', (req, res) => {
  res.send('Hello API')
})

var server = app.listen(port, () => {
  var port = server.address().port
  console.log('Start server at port ' + port + ' >> localhost:' + port)
})

app.get('/listUsers', function (req, res) {
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     console.log( data )
     res.end( data )
  })
})

app.post('/addUser', function (req, res) {
  // First read existing users.
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     data = JSON.parse( data )
     let key = Date.now()
     data[key] = req.body
     res.end( JSON.stringify(data));
  })
})