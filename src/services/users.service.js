'use strict';
const db = require('../database/init.mysql');
const bcrypt = require('bcrypt');
const ROLE = {
  ADMIN: 1,
  OWNER: 2,
  CUSTOMER: 3
};
class Users {
  static handleCheckUserExistByPhoneNumber = async (phonenumber) => {
    let sql = 'SELECT firstname, lastname, phonenumber FROM miauto.users WHERE `phonenumber` = ?;';
    const user = await db.query(sql, [phonenumber]);
    const isExitst = user.length != 0 ? true : false;
    return isExitst;
  }
  static handleInsertUser = async ({ fistname, lastname, phonenumber, password }) => {
    let sql = "INSERT INTO miauto.users (firstname, lastname, phonenumber, email, password, role_id) VALUES(?, ?, ?, ?, ?, ?);";
    let hashPassword = await bcrypt.hash(password, 10);
    let insertStatus = await db.query(sql, [fistname, lastname, phonenumber, '', hashPassword, ROLE.CUSTOMER]);
    return insertStatus.affectedRows === 1 ? true : false;
  }
  static handleSelectUserByPhonenumber = async (phonenumber) => {
    let sql = 'SELECT uid, firstname, lastname, phonenumber from users WHERE phonenumber = ?';
    let user = await db.query(sql, [phonenumber]);
    return user.length === 1 ? user[0] : null;
  }
}
module.exports = Users;