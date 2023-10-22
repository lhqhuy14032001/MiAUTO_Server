"use strict";
const express = require('express');
// const { handleVerifyToken } = require('../auth/checkAuth');
const router = express.Router()

// check API Key
// router.use(apiKey);
// check permission
// router.use(permission('0000'))
// router.use(handleVerifyToken)
router.use('/v1/api', require('./access'));

module.exports = router