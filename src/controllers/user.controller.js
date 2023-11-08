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
    let from = (1 - 1) * 10;
    let userList = await UserService.getUserList(parseInt(from));
    new OK({ message: userList.message, metadata: userList.data }).send(res);
  }
  static getUserListViewMore = async (req, res) => {
    let page = req.body.page;
    let from = (page - 1) * 10;
    let userList = await UserService.getUserList(parseInt(from));

    new OK({ message: userList.message, metadata: userList.data }).send(res);
  };
  // delete
  static deleteUser = async (req, res) => {
    let user = req.body.user;
    if (!user) {
      throw new BadRequestError("Not found user.");
    }
    if (req.uid === user.uid) {
      throw new BadRequestError("You are not delete myselft.");
    }
    let data = await UserService.deleteUser(user);
    if (!data.error) {
      new OK(data.message);
    } else {
      throw new BadRequestError(data.message);
    }
  };
}
module.exports = UserController;
