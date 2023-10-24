'use strict';
const _ = require('lodash');
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getLength = (array) => {
  let isExist = false;
  if (array.length === 0) return { isExist, data: {} };
  return { isExist: true, data: array[0] }
}



module.exports = { getInfoData, getLength };