const path = require('path');
const util = require('util');
const http = require('http');

exports.HttpError = class HttpError extends Error {
  constructor(status, msg) {
    super();

    this.status = status;
    this.msg = msg || http.STATUS_CODES[status] || "Error";
  }
};

exports.AuthError = class HttpError extends Error {
  constructor() {
    super();

    this.status = 401;
    this.msg = "You're not authorized";
  }
};