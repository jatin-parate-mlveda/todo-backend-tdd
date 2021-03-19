const { describe } = require('mocha');

const testCommon = require('./common');
const testApi = require('./api');

module.exports = () => describe('INT src/', () => {
  testCommon();
  testApi();
});
