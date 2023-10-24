"use strict";
const express = require('express');
const accessController = require('../controllers/access.controller');
const { asyncHandler } = require('../helpers/asyncHandler');
const { handleVerifyRefreshToken, handleVerifyToken } = require('../auth/checkAuth');
const router = express.Router();
// sign-up
router.post("/sign-up", asyncHandler(accessController.signUp));

// sign in
router.post("/sign-in", asyncHandler(accessController.signIn));

// sign out
router.post("/sign-out", asyncHandler(handleVerifyToken), asyncHandler(accessController.signOut))

// refresh token
router.post("/refresh-token", asyncHandler(handleVerifyRefreshToken), asyncHandler(accessController.handleRefreshToken));

module.exports = router