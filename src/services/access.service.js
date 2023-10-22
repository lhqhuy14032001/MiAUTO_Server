"use strict";
const db = require('../database/init.mysql');
const crypto = require('crypto');
const createTokenPair = require('../auth/authUtils');
const { getInfoData } = require('../ultils');
const { BadRequestError } = require('../core/error.response');

// Service //
const UsersService = require('./users.service');
const KeyTokenService = require('./keyToken.service');
const { token } = require('morgan');


class AccessService {
  static signUp = async ({ fistname, lastname, phonenumber, password }) => {
    // try {
    // step 1: check phonenumber exists?
    let isExistUser = await UsersService.handleCheckUserExistByPhoneNumber(phonenumber)
    if (isExistUser) {
      throw new BadRequestError('Error: User already register.')
    }
    const createStatus = await UsersService.handleInsertUser({ fistname, lastname, phonenumber, password })
    if (createStatus) {
      // create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      // save publickey to keyStore
      let user = await UsersService.handleSelectUserByPhonenumber(phonenumber);
      if (user) {
        const keysStore = await KeyTokenService.createKeyToken({ uid: user.uid, publicKey, privateKey });
        if (!keysStore) {
          throw new BadRequestError('Error: keysStore error.');
        }
        // created token pair
        const tokens = await createTokenPair({ uid: user.uid, phonenumber }, publicKey, privateKey);
        return {
          user: getInfoData({ fields: ['uid', 'firstname', 'lastname', 'phonenumber'], object: user }),
          tokens
        }
      }
    }
  }
}
module.exports = AccessService;