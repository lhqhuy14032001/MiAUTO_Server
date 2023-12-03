"use strict";
const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const BlogController = require("../controllers/blog.controller");
const UserController = require("../controllers/user.controller");
const EmailController = require("../controllers/email.controller");
const { route } = require("./admin.route");
// detail info
// update avt
router.post("/update-avatar", asyncHandler(UserController.updateAvatar));
// blog
router.get("/blogs-list", asyncHandler(BlogController.getAllBlogs));

// email
router.post(
  "/update-email-state",
  asyncHandler(EmailController.updateEmailState)
);

module.exports = router;
