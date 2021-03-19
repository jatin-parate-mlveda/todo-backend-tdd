const { error } = require('dotenv')
  .config({
    path: '.env.test',
  });
const {
  describe,
  before,
  after,
} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const e2e = require('./e2e');
const int = require('./int');
const unit = require('./unit');
const connectToDb = require('../src/common/connectToDb');

if (error) {
  throw error;
}

chai.use(chaiHttp);

describe('TESTs', () => {
  before(async () => {
    await connectToDb();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  unit();
  int();
  e2e();
});
