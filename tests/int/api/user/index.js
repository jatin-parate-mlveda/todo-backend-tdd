const { describe } = require('mocha');

const testUserService = require('./user.service');

module.exports = () => describe('user/', () => {
  testUserService();
});
