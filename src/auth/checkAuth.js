'use strict';
const JWT = require('jsonwebtoken');
const KeyToken = require("../services/keyToken.service");
const { AuthFailureError } = require('../core/error.response');
const { OK } = require('../core/success.response');

const handleVerifyToken = async (req, res, next) => {
  // get token from headers
  let accessToken = req.headers['accesstoken'];
  let refreshToken = req.headers['refreshtoken'];
  let _uid = req.body._uid;
  if (!accessToken || !refreshToken) throw new AuthFailureError('Invalid token.');
  let { privateKey, publicKey } = await KeyToken.findKeyByID(_uid);
  // verify token
  JWT.verify(accessToken, publicKey, (err, data) => {
    if (err) {
      throw new AuthFailureError(err.message)
    } else {
      req.data = data;
      return next();
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
    return next();
  }
}
module.exports = { handleVerifyToken, handleCheckPermission };