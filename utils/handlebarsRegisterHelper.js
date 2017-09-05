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
  return JSON.stringify(arrayList);
});

Handlebars.registerHelper('longDate', function (date) {
  return dateformat(date, 'dddd mmmm dS, yyyy HH:MM');
});

Handlebars.registerHelper('longDateNoTime', function (date) {
  return dateformat(date, 'dddd mmmm dS, yyyy');
});

Handlebars.registerHelper('shortDate', function (date) {
  return dateformat(date, 'yyyy-mm-dd');
});

Handlebars.registerHelper('shortDateDayFirst', function (date) {
  return dateformat(date, 'dd-mm-yy');
});

Handlebars.registerHelper('getTime', function (date) {
  return dateformat(date, 'HH:MM');
});

module.exports = Handlebars;
