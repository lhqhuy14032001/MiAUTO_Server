"use strict";
const db = require("../database/init.mysql");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../core/error.response");
const { OK } = require("../core/success.response");
const { PERMISSION } = require("../ultils/constants");
const { generateKey } = require("../auth/authUtils");
const { getLength } = require("../ultils/index");
// services
const KeyTokenService = require("../services/keyToken.service");
// email controller
const EmailController = require("../controllers/email.controller");

const { createTokenPair } = require("../auth/authUtils");
const VehicleService = require("./vehicle.service");

class UserService {
  static handleCheckUserExistByPhoneNumber = async (phonenumber) => {
    let sql =
      "SELECT fullname, phonenumber FROM miauto.users WHERE `phonenumber` = ?;";
    const user = await db.query(sql, [phonenumber]);
    const isExitst = user.length !== 0 ? true : false;
    return isExitst;
  };
  static handleCheckUserExistByEmail = async (email) => {
    let sql = "SELECT email, role FROM users WHERE email=?;";
    let user = await db.query(sql, [email]);
    if (user.length !== 0) return true;
    else return false;
  };
  // auth
  static registerByPhonenumber = async ({
    fullname,
    phonenumber,
    password,
  }) => {
    let sql =
      "INSERT INTO miauto.users (fullname, phonenumber, email, password, role) VALUES(?, ?, ?, ?, ?);";
    let hashPassword = await bcrypt.hash(password, 10);
    let insertStatus = await db.query(sql, [
      fullname,
      phonenumber,
      "",
      hashPassword,
      PERMISSION.CUS,
    ]);
    return insertStatus.affectedRows === 1 ? true : false;
  };
  static registerByEmail = async (email, user, role = PERMISSION.CUS) => {
    let sql =
      "INSERT INTO miauto.users ( fullname, phonenumber, email, role, google_id, avatar) VALUES( ?, ?, ?, ?, ?, ?);";
    let status = await db.query(sql, [
      user.displayName,
      "",
      email,
      role,
      user.id,
      user.photos[0].value,
    ]);
    return status.affectedRows === 1 ? true : false;
  };
  // get user
  static getUserByPhonenumber = async (phonenumber) => {
    let sql =
      "SELECT uid, fullname, phonenumber, role, avatar, phoneValid from users WHERE phonenumber = ?";
    let user = await db.query(sql, [phonenumber]);
    return user.length === 1 ? user[0] : null;
  };
  static getUserByEmail = async (email) => {
    let sql =
      "SELECT uid, fullname, phonenumber, email, role, phoneValid, emailValid, google_id, avatar FROM miauto.users WHERE email=?;";
    let user = await db.query(sql, [email]);
    return user.length === 1 ? user[0] : null;
  };
  static getUserList = async (from) => {
    let result;
    let sql =
      "SELECT uid, fullname, phonenumber, email, role, phoneValid FROM miauto.users LIMIT ?, 10;";
    let userList = await db.query(sql, from);
    if (userList.length === 0) {
      result = { msg: "Danh sách trống", data: [] };
    } else {
      result = { message: "OK", data: userList };
    }
    return result;
  };
  static getUserById = async (uid) => {
    let sql =
      "SELECT uid, fullname, phonenumber, email, role, phoneValid, google_id, avatar FROM miauto.users WHERE uid=?;";
    let user = await db.query(sql, [uid]);
    return user.length === 1 ? user[0] : null;
  };
  static getTotalUsers = async () => {
    let res = {};
    let sql = "SELECT COUNT(*) AS totalUsers FROM users";
    let total = await db.query(sql);
    if (total[0].totalUsers === 0) {
      res.total = 0;
    } else {
      res.total = total[0].totalUsers;
    }
    return res;
  };

  // create user
  static createUser = async (user) => {
    let { fullname, phonenumber, email, password, role } = user;
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    let avatar =
      "https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png";
    let phonenumberExist = await this.handleCheckUserExistByPhoneNumber(
      phonenumber
    );
    let emailExist = await this.handleCheckUserExistByEmail(email);
    if (emailExist || phonenumberExist) {
      throw new BadRequestError("Số điện thoại hoặc email đã tồn tại.");
    }
    let sql =
      "INSERT INTO miauto.users (fullname, phonenumber, email, password, role, avatar) VALUES(?, ?, ?, ?, ?, ?);";
    let status = await db.query(sql, [
      fullname,
      phonenumber,
      email,
      hashPassword,
      role,
      avatar,
    ]);
    if (status.affectedRows === 1) {
      let { privateKey, publicKey } = generateKey();
      let user = await this.getUserByEmail(email);
      if (!user) throw new BadRequestError("Tạo người dùng không thành công.");
      const keysStore = await KeyTokenService.createKeyToken({
        uid: user.uid,
        publicKey,
        privateKey,
      });
      if (!keysStore) {
        throw new BadRequestError("Tạo người dùng không thành công.");
      }
      return { error: false, message: "Tạo người dùng thành công." };
    } else {
      return { error: true, message: "Tạo người dùng không thành công." };
    }
  };
  // delete user
  static deleteUser = async (user) => {
    let isExitst = await this.getUserById(user.uid);
    let { privateKey, publicKey } = await KeyTokenService.getKeys(user.uid);
    if (!isExitst) throw new BadRequestError("User not exist.");
    if (!privateKey && !publicKey) throw new BadRequestError("User not exist.");
    let vehicleList = await VehicleService.getVehicleByUID(user.uid);
    if (vehicleList.data.length > 0) {
      await VehicleService.handleDeleteVehicleByUID(user.uid);
    }
    let stateDeleteKey = await KeyTokenService.handleDeleteKeys(user.uid);
    if (!stateDeleteKey.error) {
      let sql = "DELETE FROM users WHERE uid=?;";
      let res = await db.query(sql, [user.uid]);
      if (res.affectedRows === 1) {
        return { error: false, message: "Deleting is successfull." };
      } else {
        return { error: true, message: "Deleting is not successfull." };
      }
    } else {
      return { error: true, message: "Deleting is not successfull." };
    }
  };
  // update user
  static updateAvatar = async (uid, url) => {
    let sql = "UPDATE miauto.users SET  avatar=? WHERE uid=?;";
    let status = await db.query(sql, [url, uid]);
    if (status.affectedRows === 1) {
      return { error: false, message: "Updating is successfull." };
    } else {
      return { error: true, message: "Updating is not successfull." };
    }
  };

  static updateRoleOwner = async (uid, email) => {
    let sql, args, response;
    response = {
      err: false,
      msg: null,
      data: null,
    };
    let isExitst = await this.getUserByEmail(email);
    if (isExitst) {
      response.err = true;
      response.msg = "Email đã tồn tại trên hệ thống.";
      response.data = null;
    } else {
      sql = "UPDATE miauto.users SET email=?, role=? WHERE uid=?;";
      args = [email, PERMISSION.OW, uid];
      let result = await db.query(sql, args);
      if (result.affectedRows === 1) {
        let user = await this.getUserByEmail(email);

        let { privateKey, publicKey } = await KeyTokenService.getKeys(user.uid);
        let tokens = await createTokenPair(
          { uid: user.uid, phonenumber: user.phonenumber, role: user.role },
          publicKey,
          privateKey
        );
        response.msg = "Cập nhật thành công.";
        response.data = user;
        response.tokens = tokens;
      }
    }
    return response;
  };
}
module.exports = UserService;
