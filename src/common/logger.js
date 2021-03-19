const log4Js = require('log4js');

const logger = log4Js.configure({
  appenders: {
    out: {
      type: 'stdout',
    },
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
});

module.exports = logger;
