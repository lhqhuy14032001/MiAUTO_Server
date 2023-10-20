'use strict';

const accessService = require("../services/access.service");
const { OK, CREATED } = require('../core/success.response')

class AccessController {
  signUp = async (req, res, next) => {
    let infoSignup = req.body;
    new CREATED({
      message: 'Sign up is successfull!',
      metadata: await accessService.signUp(infoSignup)
    }).send(res);
  }
}
module.exports = new AccessController()