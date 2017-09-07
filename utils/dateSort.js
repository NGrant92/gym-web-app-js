'use strict';

const logger = require('../utils/logger');
const assessStore = require('../models/assess-store.js');

const dateSort = {

  sortByNewest(sortArray) {
    let newArray = [];

    //This sort function is used to sort the assessments by date in descending order
    newArray = sortArray.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateB - dateA;
    });

    return newArray;
  },

  sortByOldest(sortArray) {
    let newArray = [];

    //This sort function is used to sort the assessments by date in descending order
    newArray = sortArray.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateA - dateB;
    });

    return newArray;
  },
};
module.exports = dateSort;
