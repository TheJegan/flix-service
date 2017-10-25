var assert = require('assert');
var guid = require('../guid');

describe('GUID', function() {
  it('should return -1 when the value is not present', function() {
      	var firstGUID = guid();
	var isDuplicate = false;

	for(var i=0; i < 1000; i++){
		var secondGUID = guid();
		isDuplicate = (firstGUID === secondGUID)
	}
	 assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
