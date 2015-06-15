var db = require('../db')
var User = db.model('User',{
	username:  { type : String , required: true},
	password:  { type : String,  required: true},
	role    :  { type : String, required: true, default : "user"},
	date:      { type : Date, required: true, default: Date.now}
})

module.exports = User