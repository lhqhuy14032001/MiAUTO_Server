"use strict";
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const VehicleController = require("../controllers/vehicle.controller");
const EmailController = require("../controllers/email.controller");

router.post(
  "/vehicle-list",
  asyncHandler(VehicleController.getVehiCleWithStatus)
);
router.post("/provinces", asyncHandler(VehicleController.getProvinces));
router.post("/districts", asyncHandler(VehicleController.getDistricts));

// email
router.post("/verify-email", asyncHandler(EmailController.sendEmailVerify));

module.exports = router;
