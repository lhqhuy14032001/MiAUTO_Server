'use strict';
const { AuthFailureError } = require('../core/error.response');
const db = require('../database/init.mysql')
class KeyTokenService {
  static async createKeyToken({ uid, publicKey, privateKey }) {
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
  static async handleSaveRefreshTokenUsed({ uid, refreshToken }) {
    let sql = 'UPDATE miauto.keyStore SET refreshToken=? WHERE uid=?';
    let status = await db.query(sql, [refreshToken, uid]);
    return status.affectedRows === 1 ? true : false;
  }

  static async findKeyByID(_uid) {
    let sql = 'SELECT publicKey, privateKey FROM miauto.keyStore WHERE uid=?';
    let keys = await db.query(sql, [_uid]);
    if (keys.length === 0) throw new AuthFailureError('Invalid user.');
    let { privateKey, publicKey } = keys[0]
    return { privateKey, publicKey }
  }

  static async handleCheckPermission(uid, role) {
    let sql = 'SELECT role FROM users WHERE uid=?';
    let userRole = await db.query(sql, [uid]);
    if (userRole.length === 0) {
      throw new AuthFailureError('Invalid user.')
    }
    return userRole[0];
  }
}
module.exports = KeyTokenService;
