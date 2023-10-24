'use strict'
const { OK } = require('../core/success.response');
class BlogController {
  static async getAllBlogs(req, res, next) {
    console.log('blog list');
    throw new OK('okok').send(res);
  }
}

module.exports = BlogController;