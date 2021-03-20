const { describe } = require('mocha');

const testTodoService = require('./todo.service');

module.exports = () => describe('todos/', () => {
  testTodoService();
});
