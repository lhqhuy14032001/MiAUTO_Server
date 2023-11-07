const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cookieParser());

//  origin: "http://localhost:8080",
// credentials: true,
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    withCredentials: true,
  })
);

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init DB
require("./database/init.mysql");
// init router
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use("/", require("./routes"));
// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Error.",
  });
});

module.exports = app;
