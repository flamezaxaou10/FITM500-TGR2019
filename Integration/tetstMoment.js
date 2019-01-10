// import moment from 'moment'
let moment = require('moment')
let date = new Date()
let date7 = moment(date)
let dateNomin = moment(date7).subtract({
    minutes: parseInt(moment(date7).format('mm')),
    seconds: parseInt(moment(date7).format('ss'))
});
dateNomin = dateNomin.subtract(1, 'hours').format('x')
console.log(dateNomin)
