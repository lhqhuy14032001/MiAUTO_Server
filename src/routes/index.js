"use strict";
const express = require('express');
const { handleVerifyToken, handleCheckPermission } = require('../auth/checkAuth');
const { asyncHandler } = require('../helpers/asyncHandler');
const { PERMISSION } = require('../ultils/constants')
const router = express.Router();

router.use('/v1/api', require('./auth.route'));
// verify token
router.use(asyncHandler(handleVerifyToken));
// check permission
router.use(handleCheckPermission(PERMISSION.AD));
router.use('/v1/api/admin', require('./admin.route'));

module.exports = router