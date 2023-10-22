'use strict';
const db = require('../database/init.mysql')
class KeyTokenService {
  static createKeyToken = async ({ uid, publicKey, privateKey }) => {
    try {
      let sql = 'INSERT INTO miauto.keyStore (uid, publicKey, privateKey) VALUES(?, ?, ?)';
      let selectSQL = 'SELECT publicKey from miauto.keyStore WHERE uid=?';
      const keyObj = await db.query(sql, [uid, publicKey, privateKey])
      const keyString = await db.query(selectSQL, [uid])
      return keyObj.affectedRows === 1 ? keyString[0].publicKey : null
    } catch (error) {
      return error;
    }
  }
  static handleSaveRefreshTokenUsed = async ({ uid, refreshToken }) => {
    let sql = 'UPDATE miauto.keyStore SET refreshToken=? WHERE uid=?';
    let status = await db.query(sql, [refreshToken, uid]);
    console.log(status);
    return status.affectedRows === 1 ? true : false;
  }
}
module.exports = KeyTokenService;
