var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/auth-test',function(){
	console.log('mongodb connected')
})

module.exports = mongoose