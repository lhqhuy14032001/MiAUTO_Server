"use strict";
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

// generate tokens
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "30m",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
};

// generate key to sign JWT
const generateKey = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  return { privateKey, publicKey };
};

const generateAccessToken = (payload, publicKey) => {
  const accessToken = JWT.sign(payload, publicKey, { expiresIn: "10 days" });
  return accessToken;
};

const generateRefreshToken = async (payload, privateKey) => {
  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "30 days",
  });
  return refreshToken;
};

module.exports = {
  createTokenPair,
  generateKey,
  generateAccessToken,
  generateRefreshToken,
};
