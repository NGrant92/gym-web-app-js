'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const _ = require('lodash');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');
const userStore = require('../models/user-store');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');
const dateSort = require('../utils/dateSort.js');

const trainerassess = {
  
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let member = userStore.getUserById(request.params.memberid);
    const memberbmi = [];

    let assessmentArr = assessStore.getUserAssessmentList(member.id)[0].assessments;

    if (assessmentArr.length > 1) {
      assessmentArr = dateSort.sortByNewest(assessmentArr);
    }

    //bmi information of the member, determined by the calcualtions done by analytics.js
    memberbmi.latestweight = assessmentArr[0].weight;
    memberbmi.bmi = analytics.calculateBMI(member.height, memberbmi.latestweight);
    memberbmi.bmiCategory = analytics.determineBMICategory(memberbmi.bmi);
    memberbmi.idealWeight = analytics.idealWeightIndicator(member.height, memberbmi.latestweight, member.gender);

    //sorting and then setting the status of each ongoing/pending goal
    let goalsArr = goalStore.getUserGoalList(member.id)[0].goals;

    if (goalsArr.length > 1) {
      goalsArr = dateSort.sortByOldest(goalsArr);
      goalsArr = analytics.checkGoalStatus(goalsArr, assessmentArr[0], member.height);
    }

    //populating the viewData variable with the nwecessary information to load the page
    const viewData = {
      title: 'Assessments',
      user: loggedInUser,
      member: member,
      goallist: goalsArr,
      assessments: assessmentArr,
      bmi: memberbmi,
    };
    
    logger.info('about to render', viewData.title);
    response.render('trainerassess', viewData);
  },

  setComment(request, response) {
    const memberId = request.params.memberid;
    const assessId = request.params.assessid;

    const assessmentList = assessStore.getUserAssessmentList(memberId)[0].assessments;
    const assessment = assessmentList[_.findIndex(assessmentList, { id: assessId })];

    assessment.comment = request.body.comment;
    assessStore.store.save();
    logger.debug(`Adding comment to Assessment:`, request.body.comment);

    response.redirect(`/trainerassess/${memberId}`);
  },
};

module.exports = trainerassess;
