const { describe } = require('mocha');
const testApp = require('./app');

module.exports = () => describe('E2E', () => {
  testApp();
});
