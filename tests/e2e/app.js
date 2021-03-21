const { describe } = require('mocha');
const testApi = require('./api');

module.exports = () => describe('/', () => {
  testApi();
});
