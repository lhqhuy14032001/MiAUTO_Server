"use strict";
const { AuthFailureError } = require("../core/error.response");
const db = require("../database/init.mysql");
const { getLength } = require("../ultils");
class KeyTokenService {
  static async createKeyToken({ uid, publicKey, privateKey }) {
    try {
      let sql =
        "INSERT INTO miauto.keyStore (uid, publicKey, privateKey) VALUES(?, ?, ?)";
      let selectSQL = "SELECT publicKey from miauto.keyStore WHERE uid=?";
      const keyObj = await db.query(sql, [uid, publicKey, privateKey]);
      const keyString = await db.query(selectSQL, [uid]);
      return keyObj.affectedRows === 1 ? keyString[0].publicKey : null;
    } catch (error) {
      return error;
    }
  }
  static async findKeyByID(_uid) {
    let sql = "SELECT publicKey, privateKey FROM miauto.keyStore WHERE uid=?";
    let keys = await db.query(sql, [_uid]);
    if (keys.length === 0) return {};
    // throw new AuthFailureError("Người dùng không hợp lệ.");
    let { privateKey, publicKey } = keys[0];
    return { privateKey, publicKey };
  }

  static async handleCheckPermission(uid, role) {
    let sql = "SELECT role FROM users WHERE uid=?";
    let userRole = await db.query(sql, [uid]);
    if (userRole.length === 0) {
      throw new AuthFailureError("Invalid user.");
    }
    return userRole[0];
  }

  static async getKeys(uid) {
    let sql = "SELECT privateKey, publicKey From keyStore WHERE uid=?";
    let keys = await db.query(sql, [uid]);
    let { isExist, data } = getLength(keys);
    if (!isExist) throw new AuthFailureError("Người dùng không hợp lệ.");
    let { privateKey, publicKey } = data;
    return { privateKey, publicKey };
  }

  static async handleDeleteKeys(_uid) {
    let sql = "DELETE FROM miauto.keyStore WHERE uid=?;";
    let status = await db.query(sql, [_uid]);
    if (status.affectedRows === 1) throw new OK("Log out is successfull");
  }
}
module.exports = KeyTokenService;
