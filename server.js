
var port =process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');


app.use(express.static(__dirname + '/public'));
var clientinfo = {};

io.on('connection', function(socket) {
	console.log('user connected via socket.io!');
     socket.on('disconnect',function(){
     if (typeof clientinfo[socket.id]!== 'undefined') {
     	socket.leave(clientinfo[socket.id].room);
     	io.to(clientinfo[socket.id].room).emit('message',{
         name:'system',
         text:clientinfo[socket.id].name+ 'has left',
         timestamp:moment().valueOf()
     	});
     	delete clientinfo[socket.id];

     }
      
     });



	socket.on('joinroom', function(req) {
		clientinfo[socket.id]=req;
		console.log(req);

		socket.join(req.room); 
		socket.broadcast.to(req.room).emit('message',{
         name:'system',
         text:req.name+' has joined',
         timestamp:moment().valueOf()

		});



	});



	socket.on('message', function(message) {
		console.log('message recevied' + message.text);
		console.log(clientinfo[socket.id]);
		// socket.broadcast.emit('message',message);
		message.timestamp = moment().valueOf();
		io.to(clientinfo[socket.id].room).emit('message', message);
	});


	socket.emit('message', {
		name: 'system',
		text: 'welcome',
		timestamp: moment().valueOf()
	});

});


http.listen(port, function() {
	console.log('server started');
});
