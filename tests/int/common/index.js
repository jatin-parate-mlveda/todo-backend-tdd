const { describe } = require('mocha');

const testJwt = require('./jwt');

module.exports = () => describe('common/', () => {
  testJwt();
});
