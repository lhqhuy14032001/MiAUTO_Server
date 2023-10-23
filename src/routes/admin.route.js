'use strict';
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../helpers/asyncHandler');
const BlogController = require('../controllers/blog.controller')
// blog
router.get('/blogs-list', asyncHandler(BlogController.getAllBlogs));

module.exports = router

