const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json({ limit: '50mb', extended: true }))

app.get('/', (req, res) => {
  res.send('Hello API')
})

var server = app.listen(port, () => {
  var port = server.address().port
  console.log('Start server at port ' + port + ' >> localhost:' + port)
})