'use strict';
const { StatusCodes, ReasonPhrases } = require('../ultils/httpStatusCode')
const StartusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409
}
const ReasonStatusCode = {
  FORBIDDEN: 'Bad request error.',
  CONFLICT: 'Conflict error.'
}
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = ReasonStatusCode.CONFLICT) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StartusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StartusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

module.exports = { ConflictRequestError, BadRequestError, AuthFailureError }