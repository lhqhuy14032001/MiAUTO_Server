"use strict";
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const BlogController = require("../controllers/blog.controller");
const UserController = require("../controllers/user.controller");
const VehicleController = require("../controllers/vehicle.controller");
// user
router.post("/create-user", asyncHandler(UserController.createUser));
router.post("/user-list", asyncHandler(UserController.getUserList));
router.post(
  "/user-list-view-more",
  asyncHandler(UserController.getUserListViewMore)
);
router.post("/delete-user", asyncHandler(UserController.deleteUser));
router.post("/total-users", asyncHandler(UserController.getTotalUsers));
// blog
router.get("/blogs-list", asyncHandler(BlogController.getAllBlogs));
// vehicle
router.post(
  "/all-vehicle-status",
  asyncHandler(VehicleController.getVehiCleWithStatus)
);
router.post(
  "/accept-vehicle",
  asyncHandler(VehicleController.handleAcceptVehicle)
);
router.post(
  "/reject-vehicle",
  asyncHandler(VehicleController.handleRejectVehicle)
);

module.exports = router;
