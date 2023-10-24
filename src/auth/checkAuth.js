'use strict';
const JWT = require('jsonwebtoken');
const KeyTokenService = require("../services/keyToken.service");
const { AuthFailureError } = require('../core/error.response');
const { OK } = require('../core/success.response');

const handleVerifyToken = async (req, res, next) => {
  // get token from headers
  let accessToken = req.headers['access-token'];
  let _uid = req.body._uid;
  let { privateKey, publicKey } = await KeyTokenService.findKeyByID(_uid);
  if (!accessToken) throw new AuthFailureError('Invalid access token.');
  accessToken = accessToken.split(" ")[1];
  // verify token
  JWT.verify(accessToken, publicKey, async (err, data) => {
    if (err) {
      next(err);
      // throw new AuthFailureError('TokenExpired');
    } else {
      req.data = data;
      next();
    }
  })
}

const handleCheckPermission = (permission) => {
  /**
   * get role from token
   * check role of user in db
   */
  return (req, res, next) => {
    let user = req.data;
    if (user.role !== permission) { throw new AuthFailureError('Permission denied.'); }
    req.uid = user.uid
    next();
  }
}

const handleVerifyRefreshToken = async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  let _uid = req.body._uid;
  let { privateKey } = await KeyTokenService.findKeyByID(_uid);
  JWT.verify(refreshToken, privateKey, (err, user) => {
    if (err) {
      res.clearCookie("refreshToken");
      throw new AuthFailureError('Invalid refresh token.`');
    } else {
      req.user = user;
      req.privateKey = privateKey;
      next();
    }
  })
}
module.exports = { handleVerifyToken, handleCheckPermission, handleVerifyRefreshToken };