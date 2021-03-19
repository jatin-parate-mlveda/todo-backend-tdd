const { pbkdf2 } = require('crypto');
const { saltSecret } = require('./constants');

/**
 * @param {string} password
 * @returns {Promise<String>}
 */
const hashPassword = async (password = '') => await new Promise((resolve, reject) => {
  pbkdf2(password, saltSecret, 1000, 64, 'sha256', (err, derivedKey) => {
    if (err) {
      reject(err);
    } else {
      resolve(derivedKey.toString('base64'));
    }
  });
});

module.exports = hashPassword;
