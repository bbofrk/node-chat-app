var expect = require('expect');


//import isRealString
const {isRealString} = require('./validation');
//isRealString
//should reject non-string values
//should reject string with only spaces
//should allow string with non-space characters

describe('isRealString', () => {
	it('should reject non-string values', () => {
		var res = isRealString(98);
		expect(res).toBe(false);
	});

	it('should reject value with only spaces', () => {
		var res = isRealString('      ');
		expect(res).toBe(false);
	});

	it('should allow string with no-space characters', () => {
		var res = isRealString('   andrew   ');
		expect(res).toBe(true);
	});
});
