const { getUserByEmail } = require('../api/user/user.service');
const ApiError = require('./apiError');
const { resStrings } = require('./constants');
const { verify } = require('./jwt');

/**
 * @type {import('express').RequestHandler}
 */
const authMiddleware = async (req, res, next) => {
  try {
    const { cookies: { token } } = req;
    if (!token) {
      throw ApiError.unAuthorized();
    }
    req.user = await getUserByEmail((await verify(token)).email);
    if (!req.user) {
      throw ApiError.notFound(resStrings.user.notFound);
    }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(ApiError.unAuthorized());
    } else {
      next(error);
    }
  }
};

module.exports = authMiddleware;
