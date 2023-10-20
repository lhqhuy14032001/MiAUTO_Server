'use strict';
const StatusCode = {
  OK: 200,
  CREATED: 201
}
const ReasonStatusCode = {
  OK: 'Success.',
  CREATED: "Created."
}

class SuccessResponse {
  constructor({ message, statusCode = statusCode.OK, reasonStartusCode = ReasonStatusCode.OK, metadata = {} }) {
    this.message = !message ? reasonStartusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, statusCode = StatusCode.CREATED, reasonStartusCode = ReasonStatusCode.CREATED, metadata }) {
    super({ message, statusCode, reasonStartusCode, metadata })
  }
}
module.exports = { OK, CREATED }