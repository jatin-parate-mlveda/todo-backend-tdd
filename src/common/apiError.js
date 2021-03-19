const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} = require('http-codes');
const { resStrings } = require('./constants');

class ApiError {
  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }

  static internalServer(message = resStrings.internalServer) {
    return new ApiError(INTERNAL_SERVER_ERROR, message);
  }

  static notFound(message = resStrings.pageNotFound) {
    return new ApiError(NOT_FOUND, message);
  }

  static unAuthorized(message = resStrings.unAuthorized) {
    return new ApiError(UNAUTHORIZED, message);
  }

  static unProcessableEntity(message = resStrings.unProcessableEntity) {
    return new ApiError(UNPROCESSABLE_ENTITY, message);
  }
}

module.exports = ApiError;
