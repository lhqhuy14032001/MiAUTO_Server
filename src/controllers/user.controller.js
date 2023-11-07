"use strict";
const UserService = require("../services/users.service");
const { BadRequestError } = require("../core/error.response");
const { OK, CREATED } = require("../core/success.response");
class UserController {
  static async createUser(req, res) {
    let { fullname, phonenumber, email, password, role } = req.body.user;
    if (!fullname || !phonenumber || !email || !password || !role) {
      throw new BadRequestError("Vui điền đầy đủ thông tin được yêu cầu.");
    } else {
      let status = await UserService.createUser(req.body.user);
      if (!status.error) {
        throw new CREATED({ message: status.message, metadata: {} }).send(res);
      }
    }
  }
  static async getUserList(req, res) {
    /**
     * Limit 50 user
     * params: limit, from, to
     */
  }
}
module.exports = UserController;
