const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  Router,
  json,
  urlencoded,
} = require('express');
const apiRouter = require('../api/api.router');
const {
  generalErrorHandler,
  pageNotFoundHandler,
  mongoErrorHandler,
} = require('./app.controller');

const appRouter = Router();

appRouter.use(json());
appRouter.use(urlencoded({ extended: false }));
appRouter.use(cookieParser());

if (process.env.NODE_ENV === 'test-local') {
  appRouter.use(morgan('dev'));
}

appRouter.use('/api', apiRouter);

appRouter.use(pageNotFoundHandler);

appRouter.use(mongoErrorHandler);
appRouter.use(generalErrorHandler);

module.exports = appRouter;
