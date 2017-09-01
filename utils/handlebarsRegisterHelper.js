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

Handlebars.registerHelper('json', function (trainerList) {

  logger.debug('returning JSON.stringify(trainerList)');
  return  JSON.stringify(trainerList);
});

Handlebars.registerHelper('longDate', function (date) {

  logger.debug('returning longDate');
  return  dateformat(date, 'dddd mmmm dS, yyyy HH:MM');
});

Handlebars.registerHelper('shortDate', function (date) {

  logger.debug('returning shortDate', dateformat(date, 'yyyy-mm-dd'));
  return  dateformat(date, 'yyyy-mm-dd');
});

Handlebars.registerHelper('getTime', function (date) {

  logger.debug('returning time', dateformat(date, 'HH:MM'));
  return  dateformat(date, 'HH:MM');
});

module.exports = Handlebars;
