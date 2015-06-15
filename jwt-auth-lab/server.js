var express = require('express');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var jwt = require('jsonwebtoken');
var app = express();
var User = require('./models/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// VIEW

app.use('/',express.static(__dirname + '/public'));
app.get('/', function(req,res){
	res.sendFile(__dirname + '/public/view/layout.html')
})


app.post('/api/users',function(req,res){
	var user = new User({
		username : req.body.username,
		password : req.body.password
	})

	user.save(function(err,user){
		if (err) {return err};
		res.json({success : " User created"})
	})
})

app.post('/api/authenticate', function(req,res){
	User.findOne({
		username : req.body.username
	},function(err,user){
		if (err) { return err};

		if (!user) {
			res.json({ success : false, message : "Authenticate failed ! User not found"})
		}else if(user){

			if (user.password != req.body.password) {
				res.json({success : false, message : "Authenticate failed ! Wrong password"})
			} else {

				var token = jwt.sign(user,"iloveMeanStack",{
					expiresInMinutes:1440
				});

				res.json({
					success : true,
					message : "Enjoy token",
					data : {
						token : token 
					},
					role : user.role
				})

			}
		}
	})
})

app.use(function(req,res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, "iloveMeanStack", function(err,decoded){
			if (err) {
				return res.json({success:false, message: "Failed to authenticate token."})
			}else{
				req.decoded = decoded;
				next();
			}
		})
	} else {
		return res.status(403).send({
			success : false,
			message : "No token provided"
		})
	}
})


app.get('/api/users',function(req,res){
	User.find({},function(err,users){
		res.json(users);
	});
});


app.get('/api',function(req,res){
	res.json({message : " weolcome to api"})
})

app.listen(3000,function(){
	console.log('app is listening on port 3000')
})

