'use strict';
const { StatusCodes, ReasonPhrases } = require('../ultils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

module.exports = { ConflictRequestError, BadRequestError, AuthFailureError }