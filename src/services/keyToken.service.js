'use strict';
const db = require('../database/init.mysql')
class KeyTokenService {
  static createKeyToken = async ({ uid, publicKey, privateKey }) => {
    try {
      let sql = 'INSERT INTO miauto.keyStore (uid, publicKey, privateKey) VALUES(?, ?, ?)';
      let selectSQL = 'SELECT publicKey from miauto.keyStore WHERE uid=?';
      const tokens = await db.query(sql, [uid, publicKey, privateKey])
      const keyString = await db.query(selectSQL, [uid])
      return tokens.affectedRows === 1 ? keyString[0].publicKey : null
    } catch (error) {
      return error;
    }
  }
}
module.exports = KeyTokenService;
