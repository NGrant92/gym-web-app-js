'use strict';

const logger = require('../utils/logger');
const assessStore = require('../models/assess-store.js');

const dateSort = {

  sortByNewest(sortArray) {
    logger.info('assessment array input: ' + sortArray);
    let newArray = [];

    //This sort function is used to sort the assessments by date in descending order
    newArray = sortArray.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      logger.info('assessment array: ' + sortArray);
      return dateB - dateA;
    });

    return newArray;
  },

  sortByOldest(sortArray) {
    logger.info('assessment array input: ' + sortArray);
    let newArray = [];

    //This sort function is used to sort the assessments by date in descending order
    newArray = sortArray.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      logger.info('assessment array: ' + sortArray);
      return dateA - dateB;
    });

    return newArray;
  },
};
module.exports = dateSort;
