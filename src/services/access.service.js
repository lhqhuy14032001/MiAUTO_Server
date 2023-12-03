"use strict";
const db = require("../database/init.mysql");
const { createTokenPair, generateKey } = require("../auth/authUtils");
const { getInfoData, getLength } = require("../ultils");
const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt");

// Service //
const UsersService = require("./users.service");
const KeyTokenService = require("./keyToken.service");

class AccessService {
  static async signUp({ fullname, phonenumber, password, role }) {
    // try {
    // step 1: check phonenumber exists?
    let isExistUser = await UsersService.handleCheckUserExistByPhoneNumber(
      phonenumber
    );
    if (isExistUser) {
      throw new BadRequestError("Người dùng đã tồn tại trên hệ thống.");
    }
    const createUserStatus = await UsersService.registerByPhonenumber({
      fullname,
      phonenumber,
      password,
      role,
    });
    if (createUserStatus) {
      // create privateKey, publicKey
      const { privateKey, publicKey } = generateKey();
      // save publickey to keyStore
      let user = await UsersService.getUserByPhonenumber(phonenumber);
      if (user) {
        const keysStore = await KeyTokenService.createKeyToken({
          uid: user.uid,
          publicKey,
          privateKey,
        });
        if (!keysStore) {
          throw new BadRequestError("Đăng ký thất bại.");
        }
        // created token pair
        const tokens = await createTokenPair(
          { uid: user.uid, phonenumber, role: user.role },
          publicKey,
          privateKey
        );
        return {
          user: getInfoData({
            fields: [
              "uid",
              "fullname",
              "phonenumber",
              "phoneValid",
              "emailValid,",
            ],
            object: user,
          }),
          tokens,
        };
      }
    }
  }
  static async signIn(phonenumber, email, password) {
    let sql = "";
    let args = [];
    if (phonenumber) {
      sql =
        "SELECT uid, fullname, phonenumber, password, email, role, phoneValid, emailValid, avatar FROM users WHERE phonenumber=?";
      args = [phonenumber];
    } else {
      sql =
        "SELECT uid, fullname, phonenumber, password, email, emailValid, role FROM users WHERE email=?";
      args = [email];
    }
    let user = await db.query(sql, args);
    let { isExist, data } = getLength(user);
    if (!isExist) throw new BadRequestError("Người dùng không tồn tại.");
    else {
      let validPassword = await bcrypt.compare(password, data.password);
      if (validPassword) {
        let { privateKey, publicKey } = await KeyTokenService.getKeys(data.uid);
        const tokens = await createTokenPair(
          { uid: data.uid, phonenumber, role: data.role },
          publicKey,
          privateKey
        );
        delete data.password;
        return { user: data, tokens };
      } else {
        throw new BadRequestError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    }
  }

  // auth with google
  static async signUpWithGoogle(user) {
    let email = user.emails[0].value;
    let isExistUser = await UsersService.handleCheckUserExistByEmail(email);
    if (isExistUser) {
      throw new BadRequestError("Người dùng đã tồn tại trên hệ thống.");
    }
    const createUserStatus = await UsersService.registerByEmail(email, user);
    if (createUserStatus) {
      // create privateKey, publicKey
      const { privateKey, publicKey } = generateKey();
      // save publickey to keyStore
      let user = await UsersService.getUserByEmail(email);
      if (user) {
        const keysStore = await KeyTokenService.createKeyToken({
          uid: user.uid,
          publicKey,
          privateKey,
        });
        if (!keysStore) {
          throw new BadRequestError("Đăng ký thất bại.");
        }
        //     // created token pair
        const tokens = await createTokenPair(
          { uid: user.uid, email, role: user.role },
          publicKey,
          privateKey
        );
        return {
          user: getInfoData({
            fields: ["uid", "fullname", "email"],
            object: user,
          }),
          tokens,
        };
      }
    }
  }
}
module.exports = AccessService;
