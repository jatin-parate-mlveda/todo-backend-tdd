const cookieParser = require('cookie-parser');
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

appRouter.use('/api', apiRouter);

appRouter.use(pageNotFoundHandler);

appRouter.use(mongoErrorHandler);
appRouter.use(generalErrorHandler);

module.exports = appRouter;
