var expect = require('expect');
var {generateMessage} = require('./message');

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
