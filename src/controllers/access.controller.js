"use strict";
// service
const accessService = require("../services/access.service");
const KeyTokenService = require("../services/keyToken.service");

// response
const { CREATED, OK } = require("../core/success.response");
const { AuthFailureError, BadRequestError } = require("../core/error.response");
// ultil
const { regexPhoneNumber, regexPassword } = require("../ultils");
const { PERMISSION } = require("../ultils/constants");
// auth
const { handleVerifyRefreshToken } = require("../auth/checkAuth");
const { generateAccessToken } = require("../auth/authUtils");
class AccessController {
  static signUp = async (req, res) => {
    let { fullname, phonenumber, password, rePassword } = req.body;
    if (!fullname || !phonenumber || !password)
      throw new BadRequestError("Vui lòng nhập đầy đủ thông tin.");

    if (password !== rePassword)
      throw new BadRequestError("Vui lòng kiểm tra lại mật khẩu.");
    if (!regexPassword(password)) {
      throw new BadRequestError(
        "Mật khẩu có ít nhất 8 ký tự, có ít nhất một chữ số và một ký tự đặc biệt."
      );
    }
    if (!regexPhoneNumber(phonenumber))
      throw new BadRequestError("Số điện thoại không hợp lệ.");
    let data = await accessService.signUp({
      fullname,
      phonenumber,
      password,
      role,
    });
    res
      .cookie("refreshToken", `Bearer ${data.tokens.refreshToken}`, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("token", `Bearer ${data.tokens.accessToken}`, {
        httpOnly: true,
        sameSite: "strict",
      });
    new CREATED({
      message: "Sign up is successfull!",
      metadata: { user: data.user },
    }).send(res);
  };

  static async signIn(req, res) {
    let phonenumber = req.body.phonenumber || null;
    let email = req.body.email || null;
    let password = req.body.password;
    if ((!phonenumber || !email) && !password)
      throw new Error("Vui lòng nhập số điện thoại và mật khẩu.");
    if (phonenumber) {
      if (!regexPhoneNumber(phonenumber))
        throw new BadRequestError("Số điện thoại không hợp lệ.");
    }
    let data = await accessService.signIn(phonenumber, email, password);
    res
      .cookie("refreshToken", `Bearer ${data.tokens.refreshToken}`, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("token", `Bearer ${data.tokens.accessToken}`, {
        httpOnly: true,
        sameSite: "strict",
      });
    new CREATED({
      message: "Login success.",
      metadata: { user: data.user },
    }).send(res);
  }

  static async signOut(req, res) {
    let _uid = req.data.uid;
    // await KeyTokenService.handleDeleteKeys(_uid);
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
      })
      .clearCookie("_us", {
        httpOnly: true,
        sameSite: "strict",
      })
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
      });
    new OK({ message: "Sign out is successfull.", metadata: {} }).send(res);
  }

  static async handleRefreshToken(req, res) {
    let user = req.user;
    let payload = {
      uid: user.uid,
      phonenumber: user.phonenumber,
      role: user.role,
    };
    let accessToken = generateAccessToken(payload, req.publicKey);
    res.cookie("token", `Bearer ${accessToken}`, {
      httpOnly: true,
      sameSite: "strict",
    });
    new OK({
      message: "Refresh is successfull",
      metadata: { user: user, token: accessToken },
    }).send(res);
  }

  // google
  static async handleGoogleAuthSignUp(req, res) {
    let data = await accessService.signUpWithGoogle(req.user);
    res
      .cookie("refreshToken", `Bearer ${data.tokens.refreshToken}`, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("token", `Bearer ${data.tokens.accessToken}`, {
        httpOnly: true,
        sameSite: "strict",
      });
    new CREATED({
      message: "Sign up is successfull!",
      metadata: { user: data.user },
    }).send(res);
  }
}
module.exports = AccessController;
