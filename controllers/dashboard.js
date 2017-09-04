// jscs:disable disallowKeywordsOnNewLine
'use strict';// jscs:ignore validateLineBreaks
const accounts = require('./accounts.js');
const uuid = require('uuid');
const _ = require('lodash');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const userStore = require('../models/user-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');
const dateSort = require('../utils/dateSort.js');

const dashboard = {
  index(request, response) {

    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const userbmi = [];

    //if the user is a trainer then it'll redirect to the trainer dashboard
    if (loggedInUser.trainer === true) {
      logger.info('user is a trainer');
      response.redirect('/trainerboard');
    }

    //'else' is required to prevent a "Cannot read property 'assessments' of undefined" error message
    else {
      logger.info('user is a member');
      const assessmentArr = dateSort.sortByNewest(assessStore.getUserAssessmentList(loggedInUser.id)[0].assessments);

      //bmi information of the member, determined by the calcualtions done by analytics.js
      userbmi.latestweight = assessmentArr[0].weight;
      userbmi.bmi = analytics.calculateBMI(loggedInUser.height, userbmi.latestweight);
      userbmi.bmiCategory = analytics.determineBMICategory(userbmi.bmi);
      userbmi.idealWeight = analytics.idealWeightIndicator(loggedInUser.height, userbmi.latestweight, loggedInUser.gender);

      //sorting and then setting the status of each ongoing/pending goal
      let goalsArr = dateSort.sortByOldest(goalStore.getUserGoalList(loggedInUser.id)[0].goals);
      goalsArr = analytics.checkGoalStatus(goalsArr, assessmentArr[0], loggedInUser.height);

      loggedInUser.bookings = dateSort.sortByOldest(loggedInUser.bookings);

      //populating the viewData variable with the necessary information to load the page
      const viewData = {
        title: 'Dashboard',
        goallist: goalsArr,
        member: loggedInUser,
        bmi: userbmi,
        assessments: assessmentArr,
        trainerList: userStore.getAllTrainers(),
      };

      logger.info('about to render', viewData.title);
      response.render('dashboard', viewData);
    }
  },
};

module.exports = dashboard;
