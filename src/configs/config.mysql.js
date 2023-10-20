"use strict";
const dev = {
  app: process.env.DEV_APP_PORT || 3005,
  database: {
    host: process.env.DEV_APP_HOST,
    user: process.env.DEV_APP_USER,
    password: process.env.DEV_APP_PASSWORD,
    db: process.env.DEV_APP_DB_NAME,
    port: process.env.DEV_APP_DB_PORT,
  },
};
const config = { dev };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
