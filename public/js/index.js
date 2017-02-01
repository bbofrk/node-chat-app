var socket = io();
socket.on('connect', function() {
	console.log('connected to server');
	// socket.emit('createEmail', {
	// 	to: "jen@example.com",
	// 	text: "Hey. This is Andrew"
	// });

	// socket.emit('createMessage', {
	// 	from: "Andrew"
	// 	text: "Hey. This is Andrew"
	// });
});

socket.on('disconnect', function() {
	console.log('disconnected from server');
});

// socket.on('newEmail', function(email) {
// 	console.log('new email', email);
// });

socket.on('newMessage', function(message) {
	console.log('got new message', message);
	var li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`);
	$('#messages').append(li);
});

// socket.emit('createMessage', {
// 	from: 'Frank',
// 	text: 'Hi'
// }, function(callbackMessage) {
// 	console.log(callbackMessage);
// });

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {

	});
});
