"use strict";
const express = require("express");
const { handleCheckPermission } = require("../auth/checkAuth");
const { PERMISSION } = require("../ultils/constants");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const BlogController = require("../controllers/blog.controller");
const UserController = require("../controllers/user.controller");
const VehicleController = require("../controllers/vehicle.controller");

// detail info
// users
// update
router.post("/update-avatar", asyncHandler(UserController.updateAvatar));
router.post(
  "/req-update-role",
  handleCheckPermission(PERMISSION.CUS),
  asyncHandler(UserController.updateRoleOwner)
);
// blog
router.get("/blogs-list", asyncHandler(BlogController.getAllBlogs));

// vehicle
router.post("/gearboxes", asyncHandler(VehicleController.getGearboxes));
router.post("/brands", asyncHandler(VehicleController.getBrands));
router.post("/fuels", asyncHandler(VehicleController.getFuels));
router.post("/types", asyncHandler(VehicleController.getType));
router.post("/provinces", asyncHandler(VehicleController.getProvinces));
router.post("/districts", asyncHandler(VehicleController.getDistricts));
// create vehicle
router.post(
  "/register-vehicle",
  asyncHandler(VehicleController.regsiterVehicle)
);
// get all vehicle
router.post(
  "/vehicle-list",
  asyncHandler(VehicleController.getVehiCleWithStatus)
);

module.exports = router;
