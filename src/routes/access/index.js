"use strict";
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../ultils');
const router = express.Router();
// sign-up
router.post("/sign-up", asyncHandler(accessController.signUp));
module.exports = router