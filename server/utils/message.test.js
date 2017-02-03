var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		// store res in variable
		var from = 'Jen';
		var text = 'Some message';
		var message = generateMessage(from, text);
		// assert from match
		expect(message.createdAt).toBeA('number');
		// asert text match
		expect(message).toInclude({
			from, text
		});
		// asert createdAtis number
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		// store res in variable
		var from = 'Deb';
		var latitude = 15;
		var longitude = 19;
		var url = `https://www.google.com/maps?q=15,19`
		var message = generateLocationMessage(from, latitude, longitude);
		// assert from match
		expect(message.createdAt).toBeA('number');
		// asert text match
		expect(message).toInclude({
			from, url
		});
		// asert createdAtis number
	});
});
