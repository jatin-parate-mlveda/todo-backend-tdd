const { describe } = require('mocha');

const testUser = require('./user');

module.exports = () => describe('api/', () => {
  testUser();
});
