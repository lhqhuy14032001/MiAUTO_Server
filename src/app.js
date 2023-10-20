const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init DB
require("./database/init.mysql");
// init router
app.use(express.json());
app.use('/', require('./routes'))
// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Error.'
  })
})

module.exports = app;
