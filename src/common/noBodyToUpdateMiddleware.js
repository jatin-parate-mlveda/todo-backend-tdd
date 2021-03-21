const { body } = require('express-validator');
const { resStrings } = require('./constants');

module.exports = body().custom((reqBody) => {
  if (Object.keys(reqBody).length === 0) {
    throw resStrings.noBodyToUpdate;
  }

  return true;
});
