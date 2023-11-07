"use strict";
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const BlogController = require("../controllers/blog.controller");
const UserController = require("../controllers/user.controller");
// user
router.post("/create-user", asyncHandler(UserController.createUser));
router.get("user-list", asyncHandler(UserController.getAllUser));
// blog
router.get("/blogs-list", asyncHandler(BlogController.getAllBlogs));

module.exports = router;
