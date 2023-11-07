"use strict";
const express = require("express");
const accessController = require("../controllers/access.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const {
  handleVerifyRefreshToken,
  handleVerifyToken,
} = require("../auth/checkAuth");
const passport = require("passport");
const passportConfig = require("../auth/passport");
const router = express.Router();
// sign-up
router.post("/sign-up", asyncHandler(accessController.signUp));

// sign in
router.post("/sign-in", asyncHandler(accessController.signIn));

//google auth
router.post(
  "/google-sign-up",
  passport.authenticate("google"),
  asyncHandler(accessController.handleGoogleAuthSignUp)
);
router.post(
  "auth/google/return_err",
  passport.authenticate("google"),
  (req, res) => {
    res.status(400).json({ message: "Loi dang nhap" });
  }
);

// sign out
router.post(
  "/sign-out",
  asyncHandler(handleVerifyToken),
  asyncHandler(accessController.signOut)
);

// refresh token
router.post(
  "/refresh-token",
  asyncHandler(handleVerifyRefreshToken),
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
