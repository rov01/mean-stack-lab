var express = require('express');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Post = require('./models/post');
var chatnsp  = io.of('/chat')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// VIEW

app.use('/',express.static(__dirname + '/public'));
app.get('/', function(req,res){
	res.sendFile(__dirname + '/public/views/layout.html')
})


app.post('/api/posts',function(req,res){

	// res.json({success: req.body.body})
	var post = new Post({
		body : req.body.body
	})

	post.save(function(err,post){
		if (err) {return err};

		io.emit('new_post',post)
		chatnsp.emit('new_chat',"hi new chat") // namespace 

		res.json(post)
	})
})


app.get('/api/posts',function(req,res){

	Post.find()
	.sort('-date')
	.exec(function(err,posts){
		if (err) {return next(err)}
		res.json(posts)
	})
})


io.on('connection', function(socket){
	// socket.broadcast.emit('user connected');
	console.log('user connect')
	io.on('disconnect',function(msg){
		console.log("user disconnected")
	})

});

// io.emit('new_post',"hi new post")


chatnsp.on('connection', function(socket){
  console.log('someone connected')
});



server.listen(3000,function(){
	console.log("app is listening on port 3000")
})