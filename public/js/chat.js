var socket = io();

function scrollToBottom() {
	//Selectors
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	console.log('connected to server');
	var params = $.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No Error');
		}
	});
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
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// console.log('got new message', message);
	// var li = $('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);
	// $('#messages').append(li);
});

// socket.emit('createMessage', {
// 	from: 'Frank',
// 	text: 'Hi'
// }, function(callbackMessage) {
// 	console.log(callbackMessage);
// });

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// var li = $('<li></li>');
	// var a = $('<a target="_blank">My current location</a>');
	// li.text(`${message.from} ${formattedTime}:`);
	// a.attr('href', message.url);
	// li.append(a);
	// $('#messages').append(li);
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
	scrollToBottom();
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
