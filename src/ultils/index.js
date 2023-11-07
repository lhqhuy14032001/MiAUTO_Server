"use strict";
const _ = require("lodash");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getLength = (array) => {
  let isExist = false;
  if (array.length === 0) return { isExist, data: {} };
  return { isExist: true, data: array[0] };
};

const regexPhoneNumber = (phone) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  return phone.match(regexPhoneNumber) ? true : false;
};

const regexPassword = (password) => {
  const regexPass =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
  return password.match(regexPass) ? true : false;
};

module.exports = { getInfoData, getLength, regexPhoneNumber, regexPassword };
