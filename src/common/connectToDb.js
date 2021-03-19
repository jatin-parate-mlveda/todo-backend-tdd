const { connect } = require('mongoose');
const { dbUrl } = require('./constants');

const connectToDb = () => connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = connectToDb;
