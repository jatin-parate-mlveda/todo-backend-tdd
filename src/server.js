const http = require('http');

const connectToDb = require('./common/connectToDb');
const app = require('./app/app');
const { port } = require('./common/constants');
const addProcessListeners = require('./common/addProcessListeners');
const logger = require('./common/logger').getLogger('server');

connectToDb()
  .then(() => {
    const server = http.createServer(app);

    server.listen(port, () => {
      logger.info(`App started on port ${port}`);
    });

    addProcessListeners();
  })
  .catch((err) => {
    logger.error(err);
    process.exit(134); // SIGABRT
  });
