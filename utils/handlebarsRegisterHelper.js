'use strict';

const dateformat = require('dateformat');
const Handlebars = require('handlebars');
const logger = require('../utils/logger');
const _ = require('lodash');

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('checkAllLessons', function (classObj) {
  let lessonList = classObj.lessonList;
  let isFull = true;

  for (let i = 0; i < lessonList.length; i++) {
    if (lessonList[i].memberList.length < classObj.maxMembers) {
      isFull = false;
      break;
    }
  }

  return isFull;
});

Handlebars.registerHelper('checkLesson', function (memberList, userid) {
  return memberList.indexOf(userid);
});

Handlebars.registerHelper('checkAllMemLessons', function (lessonList, userid) {
  let isEnrolled = true;

  for (let i = 0; i < lessonList.length; i++) {
    if (lessonList[i].memberList.indexOf(userid) < 0) {
      isEnrolled = false;
      break;
    }
  }

  return isEnrolled;
});

Handlebars.registerHelper('json', function (arrayList) {

  //logger.info('returning JSON.stringify(arrayList)');
  return  JSON.stringify(arrayList);
});

Handlebars.registerHelper('longDate', function (date) {

  logger.info('returning longDate');
  return  dateformat(date, 'dddd mmmm dS, yyyy HH:MM');
});

Handlebars.registerHelper('shortDate', function (bookingdate) {

  logger.info('intial date: ', bookingdate);
  logger.info('returning shortDate', dateformat(bookingdate, 'yyyy-mm-dd'));
  return  dateformat(bookingdate, 'yyyy-mm-dd');
});

Handlebars.registerHelper('getTime', function (bookingdate) {

  logger.info('intial date: ', bookingdate);
  logger.info('returning time', dateformat(bookingdate, 'HH:MM'));
  return  dateformat(bookingdate, 'HH:MM');
});

module.exports = Handlebars;
