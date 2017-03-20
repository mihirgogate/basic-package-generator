var test = require('tape');
var lib = require('./lib');

test("it makes sure no error occurs", function t(assert){
    lib.generateSimplePackage('directory/path/package_name', function _cb(err, res){
      assert.ifError(err);
      assert.end();
    });
});
