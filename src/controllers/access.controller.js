'use strict';

const accessService = require("../services/access.service");
const { CREATED } = require('../core/success.response')

class AccessController {
  static signUp = async (req, res) => {
    let infoSignup = req.body;
    let data = await accessService.signUp(infoSignup);
    res
      .cookie('accessToken', data.tokens.accessToken, {
        httpOnly: true,
        sameSite: true
      })
      .cookie('refreshToken', data.tokens.refreshToken, {
        httpOnly: true,
        sameSite: true
      });
    new CREATED({
      message: 'Sign up is successfull!',
      metadata: data.user
    }).send(res);
  }

  static async signIn(req, res) {
    // let accessToken = req.headers['accesstoken'];
    // let refreshToken = req.headers['refreshtoken'];
    console.log('okok');

    new CREATED({ metadata: { token: 'khjghjghj' } }).send(res);
  }
}
module.exports = AccessController