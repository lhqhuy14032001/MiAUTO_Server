"use strict";
const db = require('../database/init.mysql');
const { createTokenPair, generateKey } = require('../auth/authUtils');
const { getInfoData, getLength } = require('../ultils');
const { BadRequestError } = require('../core/error.response');

// Service //
const UsersService = require('./users.service');
const KeyTokenService = require('./keyToken.service');



class AccessService {
  static async signUp({ fistname, lastname, phonenumber, password }) {
    // try {
    // step 1: check phonenumber exists?
    let isExistUser = await UsersService.handleCheckUserExistByPhoneNumber(phonenumber)
    if (isExistUser) {
      throw new BadRequestError('Error: User already register.')
    }
    const createUserStatus = await UsersService.handleInsertUser({ fistname, lastname, phonenumber, password })
    if (createUserStatus) {
      // create privateKey, publicKey
      const { privateKey, publicKey } = generateKey();
      // save publickey to keyStore
      let user = await UsersService.handleSelectUserByPhonenumber(phonenumber);
      if (user) {
        const keysStore = await KeyTokenService.createKeyToken({ uid: user.uid, publicKey, privateKey });
        if (!keysStore) {
          throw new BadRequestError('Error: keysStore error.');
        }
        // created token pair
        const tokens = await createTokenPair({ uid: user.uid, phonenumber, role: user.role }, publicKey, privateKey);
        return {
          user: getInfoData({ fields: ['uid', 'firstname', 'lastname', 'phonenumber'], object: user }),
          tokens
        }
      }
    }
  }
  static async signIn(phonenumber, email, password) {
    let sql = '';
    let args = [];
    if (phonenumber) {
      sql = 'SELECT uid, firstname, lastname, phonenumber, email FROM users WHERE phonenumber=?';
      args = [phonenumber];
    } else {
      sql = 'SELECT uid, firstname, lastname, phonenumber, email FROM users WHERE email=?';
      args = [email];
    }
    let user = await db.query(sql, args);
    let { isExist, data } = getLength(user);
    if (!isExist) throw new BadRequestError('Invalid user.');
    let { privateKey, publicKey } = await KeyTokenService.getKeys(data.uid);
    const tokens = await createTokenPair({ uid: data.uid, phonenumber, role: user.role }, publicKey, privateKey);
    return { user: data, tokens };
  }
}
module.exports = AccessService;