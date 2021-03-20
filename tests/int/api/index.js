const { describe } = require('mocha');

const testUser = require('./user');
const testTodo = require('./todo');

module.exports = () => describe('api/', () => {
  testUser();
  testTodo();
});
