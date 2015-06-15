var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/real-time-app',function(){
	console.log('mongodb connected')
})

module.exports = mongoose