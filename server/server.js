const path = require('path');
const http = require('http'); //from node
const express = require('express');
const socketIO = require('socket.io');

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

	socket.emit('newMessage', {
		from: "Andrew",
		text: "Can you meet at 6?",
		createdAt: 123
	});

	// socket.on('createEmail', (newEmail) => {
	// 	console.log('createEmail', newEmail);
	// });
	socket.on('createMessage', (message) => {
		console.log('create message', message);
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
