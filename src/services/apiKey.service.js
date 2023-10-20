'use strict';
const db = require('../database/init.mysql');
const crypto = require('crypto');
const findById = async (key) => {
  // const newKey = crypto.randomBytes(64).toString('hex')
  // let sql = 'INSERT INTO miauto.apiKey (apiKey, status, permissions) VALUES(?, 1, ?);'
  // let test = await db.query(sql, [newKey, '0000']);
  // console.log(test);
  let getApiKeySQL = "SELECT apiKey, status, permissions FROM miauto.apiKey WHERE apiKey=? AND status=?;";
  const objKey = await db.query(getApiKeySQL, [key, true]);
  // console.log(objKey);
  return objKey[0]
}

module.exports = { findById };