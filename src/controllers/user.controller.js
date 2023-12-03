"use strict";
const UserService = require("../services/users.service");
const { BadRequestError } = require("../core/error.response");
const { CREATED, OK } = require("../core/success.response");
const EmailController = require("./email.controller");
class UserController {
  static async createUser(req, res) {
    let { fullname, phonenumber, email, password, role } = req.body.user;
    if (!fullname || !phonenumber || !email || !password || !role) {
      throw new BadRequestError("Vui điền đầy đủ thông tin được yêu cầu.");
    } else {
      let status = await UserService.createUser(req.body.user);
      if (!status.error) {
        new CREATED({ message: status.message, metadata: {} }).send(res);
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
  static getTotalUsers = async (req, res) => {
    let result = await UserService.getTotalUsers();
    new OK({ metadata: result.total }).send(res);
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
  // update
  static updateAvatar = async (req, res) => {
    let url = req.body.url;
    let uid = req.data.uid;
    let result = await UserService.updateAvatar(uid, url);
    if (!result.error) {
      new OK("OK").send(res);
    } else {
      throw new BadRequestError(result.message);
    }
  };
  static updateRoleOwner = async (req, res) => {
    let uid = req.uid;
    let email = req.body.email;
    let { err, msg, data, tokens } = await UserService.updateRoleOwner(
      uid,
      email
    );
    if (!err) {
      res.cookie("refreshToken", `Bearer ${tokens.refreshToken}`, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.cookie("token", `Bearer ${tokens.accessToken}`, {
        httpOnly: true,
        sameSite: "strict",
      });
      new OK({ message: msg, metadata: data }).send(res);
    }
    throw new BadRequestError({ message: msg });
  };
}
module.exports = UserController;
