'use strict';
const _ = require('lodash');
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}
const asyncHandler = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  }
}
module.exports = { getInfoData, asyncHandler };