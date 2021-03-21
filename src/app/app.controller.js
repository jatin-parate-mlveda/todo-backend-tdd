const { Error: { ValidationError, CastError } } = require('mongoose');
const ApiError = require('../common/apiError');
const { frontEndUrl } = require('../common/constants');
const logger = require('../common/logger')
  .getLogger('app.controller');

/** @type {import('@types/express').RequestHandler} */
const pageNotFoundHandler = async (req, res, next) => {
  try {
    res.redirect(frontEndUrl);
  } catch (error) {
    next(error);
  }
};

/** @type {import('@types/express').ErrorRequestHandler} */
const generalErrorHandler = async (err, {
  method,
  path,
  query,
  body,
}, res, next) => {
  try {
    let errorToSend;
    if (err instanceof ApiError) {
      errorToSend = err;
    } else {
      errorToSend = ApiError.internalServer();
      logger.error(err.stack, {
        query,
        path,
        method,
        body,
      });
    }
    const {
      statusCode,
      message,
      ...otherData
    } = errorToSend;
    res.status(statusCode)
      .json({
        error: {
          message,
          ...otherData,
        },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @type {import('@types/express').ErrorRequestHandler}
 */
const mongoErrorHandler = async (reqError, _req, _res, next) => {
  try {
    if (reqError instanceof ValidationError) {
      next(
        ApiError.unProcessableEntity(
          reqError.errors[Object.keys(reqError.errors)[0]].message,
        ),
      );
    } else if (reqError instanceof CastError) {
      next(
        ApiError.unProcessableEntity(reqError.message),
      );
    } else {
      next(reqError);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pageNotFoundHandler,
  generalErrorHandler,
  mongoErrorHandler,
};
