// jscs:disable disallowKeywordsOnNewLine
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
  let isEnrolled = false;

  //a for loop that is going through the lesson list and checking if member is enrolled
  //if it returns false then the 'Unenroll All' button will not be viewable
  for (let i = 0; i < lessonList.length; i++) {
    if (lessonList[i].memberList.indexOf(userid) >= 0) {
      isEnrolled = true;
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

Handlebars.registerHelper('dateMonth', function (date) {
  return dateformat(date, 'dS mmmm');
});

Handlebars.registerHelper('dayMonthDate', function (date) {
  return dateformat(date, 'dddd, mmmm dS');
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

Handlebars.registerHelper('getHour', function (duration) {

  const hr = duration.indexOf('hr');

  if (hr >= 0) {
    return duration.substr(0, hr);
  }
  else {
    return 0;
  }
});

Handlebars.registerHelper('getMins', function (duration) {
  const mins = duration.indexOf('mins');

  if (mins >= 0) {
    return duration.substring(mins - 2, mins);
  }
  else {
    return 0;
  }
});

module.exports = Handlebars;
