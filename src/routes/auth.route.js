"use strict";
const express = require('express');
const accessController = require('../controllers/access.controller');
const { asyncHandler } = require('../helpers/asyncHandler');
const router = express.Router();
// sign-up
router.post("/sign-up", asyncHandler(accessController.signUp));
// sign in
router.post("/sign-in", asyncHandler(accessController.signIn));
module.exports = router