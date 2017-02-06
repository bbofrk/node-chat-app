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

socket.on('newLocationMessage', function(message) {
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');
	li.text(`${message.from}:`);
	a.attr('href', message.url);
	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	var messageTextBox = $('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextBox.val()
	}, function() {
		messageTextBox.val("");
	});
});


var locationButton = $("#send-location");
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disable').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
		locationButton.removeAttr('disabled').text('Send location');
	}, function() {
		alert('Unable to fetch location');
		locationButton.removeAttr('disabled').text('Send location');
	});
});
