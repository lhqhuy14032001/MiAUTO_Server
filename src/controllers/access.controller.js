'use strict'
// service
const accessService = require("../services/access.service");
const KeyTokenService = require("../services/keyToken.service");

// response
const { CREATED, OK } = require('../core/success.response');
const { AuthFailureError, BadRequestError } = require('../core/error.response');

// auth
const { handleVerifyRefreshToken } = require('../auth/checkAuth');
const { generateAccessToken } = require('../auth/authUtils')
class AccessController {
  static signUp = async (req, res) => {
    let { fistname, lastname, phonenumber, password } = req.body;
    if (!fistname || !lastname || !phonenumber, !password) throw new BadRequestError('Missing parameter.')
    let data = await accessService.signUp({ fistname, lastname, phonenumber, password });
    res.cookie('refreshToken', data.tokens.refreshToken, {
      httpOnly: true,
      sameSite: "Strict"
    });
    new CREATED({
      message: 'Sign up is successfull!',
      metadata: { user: data.user, token: data.tokens.accessToken }
    }).send(res);
  }

  static async signIn(req, res) {
    let phonenumber = req.body.phonenumber || null;
    let email = req.body.email || null;
    let password = req.body.password;
    if ((!phonenumber || !email) && !password) throw new Error('Missing parameters.');
    let data = await accessService.signIn(phonenumber, email, password);
    res.cookie('refreshToken', data.tokens.refreshToken, {
      httpOnly: true,
      sameSite: "Strict"
    })
    new CREATED({ message: 'Login success.', metadata: { user: data.user, token: data.tokens.accessToken } }).send(res);
  }

  static async signOut(req, res) {
    let _uid = req.data.uid;
    await KeyTokenService.handleDeleteKeys(_uid);
    res.clearCookie("refreshToken");
  }

  static async handleRefreshToken(req, res) {
    let user = req.body;
    let payload = {
      uid: user.uid,
      phonenumber: user.phonenumber,
      role: user.role
    }
    let accessToken = generateAccessToken(payload, req.privateKey)
    throw new OK({ message: 'Refresh is successfull', metadata: { user: req.user, token: accessToken } }).send(res);
  }
}
module.exports = AccessController