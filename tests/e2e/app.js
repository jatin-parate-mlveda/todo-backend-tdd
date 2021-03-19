const { NOT_FOUND } = require('http-codes');
const {
  describe,
  it,
} = require('mocha');
const chai = require('chai');
const app = require('../../src/app/app');
const { resStrings } = require('../../src/common/constants');

const { expect } = chai;

const testApi = require('./api');

module.exports = () => describe('/', () => {
  describe('GET: /', () => {
    it('should return not found error', async () => {
      const res = await chai.request(app)
        .get('/');
      expect(res).to.be.json;
      expect(res)
        .to
        .have
        .status(NOT_FOUND);
      expect(res.body)
        .to
        .have
        .property('error')
        .to
        .be
        .an('object')
        .to
        .have
        .property('message')
        .to
        .be
        .equal(resStrings.pageNotFound);
    });
  });

  testApi();
});
