const { validationResult } = require('express-validator');
const ApiError = require('./apiError');

/**
 * @type {import('@types/express').RequestHandler}
 */
const validateReq = async (req, _res, next) => {
  try {
    const validationRes = validationResult(req);
    if (validationRes.isEmpty()) {
      next();
    } else {
      next(
        ApiError.unProcessableEntity(
          validationRes.array({ onlyFirstError: true })[0].msg,
        ),
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = validateReq;
