'use strict';

const accessService = require("../services/access.service");
const { CREATED } = require('../core/success.response')

class AccessController {
  static signUp = async (req, res) => {
    let infoSignup = req.body;
    let data = await accessService.signUp(infoSignup);
    res
      .cookie('accesstoken', data.tokens.accessToken, {
        httpOnly: true,
        sameSite: true
      })
      .cookie('refreshtoken', data.tokens.refreshToken, {
        httpOnly: true,
        sameSite: true
      });
    new CREATED({
      message: 'Sign up is successfull!',
      metadata: data.user
    }).send(res);
  }

  static async signIn(req, res) {
    // let accessToken = req.headers['accesstoken'].split(" ")[1];
    // let refreshToken = req.headers['refreshtoken'].split(" ")[1];
    // console.log('check access token:::::::', accessToken);
    // console.log('check refresh token:::::::', refreshToken);

    new CREATED({ metadata: { token: 'khjghjghj' } }).send(res);
  }
}
module.exports = AccessController