"use strict";
const mysql = require("mysql2");
const {
  database: { host, user, password, db, port },
} = require("../configs/config.mysql");

class Database {
  constructor() {
    this.pool = this.connect();
  }
  connect() {
    try {
      let pool = mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: db,
        port: port,
      });
      console.log("The connection to database has established.");
      return pool;
    } catch (error) {
      console.log("The connection to database hasn't established.");
    }
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, (error, results) => {
        if (error) {
          console.log(">>>>>An error occurred during the query.", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          console.log(
            "An error occurred during closing the database connection"
          );
          console.log(err);
          return reject(err);
        }
        resolve();
      });
    });
  }
}
const poolMysql = new Database();

module.exports = poolMysql;
