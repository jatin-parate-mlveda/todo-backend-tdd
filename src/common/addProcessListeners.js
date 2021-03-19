const { disconnect } = require('mongoose');
const logger = require('./logger').getLogger('addProcessListener');

const handleProcessError = ({ cleanup, exit }, exitCode) => {
  if (cleanup) {
    disconnect()
      .finally(() => {
        if (exit) {
          process.exit(exitCode);
        }
      });
  } else if (exit) {
    process.exit(exitCode);
  }
};

const addProcessListeners = () => {
  process.on('uncaughtException', (err) => {
    logger.error('caught unknown error', err);
    handleProcessError({}, 134); // SIGABRT
  });

  // user wants to exit
  process.on(
    'SIGINT',
    () => handleProcessError({ cleanup: true, exit: true }, 130),
  ); // SIGINT
  process.on(
    'SIGTERM',
    () => handleProcessError({ cleanup: true, exit: true }, 143),
  ); // SIGTERM

  // kill pid
  process.on('SIGUSR1', () => handleProcessError({ exit: true }, 130)); // SIGINT
  process.on('SIGUSR2', () => handleProcessError({ exit: true }, 130)); // SIGINT
};

module.exports = addProcessListeners;
