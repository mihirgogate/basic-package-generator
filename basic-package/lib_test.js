var test = require('tape');
var lib = require('./lib');

test("it gets data", function t(assert){
    assert.equals(lib.getData(), 'package is toggled');
    assert.end();
});
