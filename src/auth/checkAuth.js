"use strict";
const JWT = require("jsonwebtoken");
const KeyTokenService = require("../services/keyToken.service");
const { AuthFailureError, AccessDenied } = require("../core/error.response");
const { OK } = require("../core/success.response");
const { PERMISSION } = require("../ultils/constants");

const handleVerifyToken = async (req, res, next) => {
  // get token from http cookie
  let accessToken = req.cookies.token;
  if (req.body.role === PERMISSION.AD) {
    accessToken = req.cookies.tokenAD;
  } else {
    accessToken = req.cookies.token;
  }
  let _uid = req.body._uid;
  let { privateKey, publicKey } = await KeyTokenService.findKeyByID(_uid);
  if (!accessToken) throw new AccessDenied("Invalid access token.");
  accessToken = accessToken.split(" ")[1];
  // verify token
  JWT.verify(accessToken, publicKey, async (err, data) => {
    if (err) {
      next(err);
      // next({ error: err, status: 500 });
    } else {
      req.data = data;
      next();
    }
  });
};

const handleCheckPermission = (permission) => {
  return (req, res, next) => {
    let user = req.data;
    if (user.role !== permission) {
      throw new AuthFailureError("Permission denied.");
    }
    req.uid = user.uid;
    next();
  };
};

const handleVerifyRefreshToken = async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  let _uid = req.body._uid;
  let { privateKey, publicKey } = await KeyTokenService.findKeyByID(_uid);
  if (!refreshToken) throw new AccessDenied("Invalid refreshToken token.");
  refreshToken = refreshToken.split(" ")[1];
  JWT.verify(refreshToken, privateKey, (err, user) => {
    if (err) {
      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
        })
        .clearCookie("token", {
          httpOnly: true,
          sameSite: "strict",
        });
      next({ error: err, status: 403 });
    } else {
      req.user = user;
      req.publicKey = publicKey;
      next();
    }
  });
};
module.exports = {
  handleVerifyToken,
  handleCheckPermission,
  handleVerifyRefreshToken,
};
