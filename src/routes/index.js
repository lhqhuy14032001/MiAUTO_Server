"use strict";
const express = require("express");
const {
  handleVerifyToken,
  handleCheckPermission,
} = require("../auth/checkAuth");
const { asyncHandler } = require("../helpers/asyncHandler");
const { PERMISSION } = require("../ultils/constants");
const router = express.Router();

router.use("/v1/api/auth", require("./auth.route"));
router.use("/v1/api/public", require("./public.route"));
// verify token
router.use(asyncHandler(handleVerifyToken));
router.use(
  "/v1/api/admin",
  handleCheckPermission(PERMISSION.AD),
  require("./admin.route")
);
// owner
router.use(
  "/v1/api/owner",
  handleCheckPermission(PERMISSION.OW),
  require("./owner.route")
);
// client
router.use("/v1/api/client", require("./client.route"));

module.exports = router;
