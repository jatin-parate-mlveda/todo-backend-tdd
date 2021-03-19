const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./constants');

const sign = async (payload) => await new Promise((resolve, reject) => {
  try {
    jwt.sign(payload, jwtSecret, (err, signedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(signedToken);
      }
    });
  } catch (error) {
    reject(error);
  }
});

/** @param {string} token */
const verify = async (token) => await new Promise((resolve, reject) => {
  try {
    jwt.verify(token, jwtSecret, {
      ignoreExpiration: true,
    }, (jwtError, data) => {
      if (jwtError) {
        reject(jwtError);
      } else {
        resolve(data);
      }
    });
  } catch (error) {
    reject(error);
  }
});

module.exports = {
  sign,
  verify,
};
