'use strict';

const logger = require('../utils/logger');
const assessStore = require('../models/assess-store.js');

const dateSort = {

  sortByNewest(sortArray) {
    let newArray = [];
    logger.debug(sortArray);

    let currArray = [];

    if(sortArray.length > 1){
      //This sort function is used to sort the assessments by date in descending order
      newArray = sortArray.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB - dateA;
      });
    }


    return newArray;
  },

  sortByOldest(sortArray) {
    let newArray = [];
    logger.debug(sortArray);

    if(sortArray.length > 1) {
      //This sort function is used to sort the assessments by date in descending order
      newArray = sortArray.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateA - dateB;
      });
    }

    return newArray;
  },
};
module.exports = dateSort;
