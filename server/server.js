const path = require('path');
const http = require('http'); //from node
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));
io.on('connection', (socket) => {
	console.log('New user connected');
	// socket.emit('newEmail', {
	// 	from: "mike@example.com",
	// 	text: "What is going on?",
	// 	createdAt: 123
	// });
	//
	// socket.on('createEmail', (newEmail) => {
	// 	console.log('createEmail', newEmail);
	// });

	// socket.emit('newMessage', {
	// 	from: "Andrew",
	// 	text: "Can you meet at 6?",
	// 	createdAt: 123
	// });

	// socket.on('createEmail', (newEmail) => {
	// 	console.log('createEmail', newEmail);
	// });

	// socket.emit from Admin text Welcome to the chat app
	// socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
	//
	// socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));
	// socket.broadcast.emit from admin text New user joined

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		socket.broadcast.emit('newMessage', generateMessage('Admin', `${params.name} joined`)).to(params.room);
		//io.emit (to everyone) -> io.to().emit
		//socket.broadcast (to everyone except for self) -> socket.broadcast().to();
		//socket.emit (targeted person) ->
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		console.log('create message', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();

		// io.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('createLocationMessage', (coords) => {
		// io.emit('newMessage', generateMessage('Admin', `${coords.latitude, coords.longitude}`));
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
		var user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left the room. `));
		}
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
