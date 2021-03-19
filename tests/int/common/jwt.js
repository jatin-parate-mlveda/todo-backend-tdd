const jwt = require('jsonwebtoken');
const {
  describe,
  it,
} = require('mocha');
const { expect } = require('chai');
const { sign } = require('../../../src/common/jwt');

const secret = process.env.JWT_SECRET;

const payload = { name: 'jatin parate' };

module.exports = () => describe('jwt.js', () => {
  describe('sign', () => {
    it('should sign jwt successfully', (done) => {
      jwt.sign(payload, secret, (err, signedKey) => {
        try {
          if (err) {
            done(err);
          } else {
            const resultPromise = sign(payload);
            expect(resultPromise)
              .to
              .be
              .instanceof(Promise);
            resultPromise
              .then((key) => {
                expect(key)
                  .to
                  .exist;
                expect(key)
                  .to
                  .be
                  .equal(signedKey);
                done();
              })
              .catch((signErr) => {
                done(signErr);
              });
          }
        } catch (unknownErr) {
          done(unknownErr);
        }
      });
    });
  });
});
