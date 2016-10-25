var test = require('tape');
const createHtml = require('../extension/src/js/background/createHtml')

test('timing test', function (t) {

    t.equal(createHtml('0'), '0')
});
