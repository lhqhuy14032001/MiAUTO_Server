"use strict";
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const BlogController = require("../controllers/blog.controller");
const UserController = require("../controllers/user.controller");
// user
router.post("/create-user", asyncHandler(UserController.createUser));
router.post("/user-list", asyncHandler(UserController.getUserList));
router.post(
  "/user-list-view-more",
  asyncHandler(UserController.getUserListViewMore)
);
router.post("/delete-user", asyncHandler(UserController.deleteUser));
// blog
router.get("/blogs-list", asyncHandler(BlogController.getAllBlogs));

module.exports = router;
