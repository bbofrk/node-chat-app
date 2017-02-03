const path = require('path');
const http = require('http'); //from node
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

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
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));
	// socket.broadcast.emit from admin text New user joined

	socket.on('createMessage', (message, callback) => {
		console.log('create message', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from the server');
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
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
