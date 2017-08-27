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

const trainerassess = {
  
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let member = userStore.getUserById(request.params.memberid);
    const memberbmi = [];

    const assessmentArr = assessStore.getUserAssessmentList(member.id)[0].assessments;

    //This sort function is used to sort the assessments by date in descending order
    assessmentArr.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateB - dateA;
    });

    //bmi information of the member, determined by the calcualtions done by analytics.js
    memberbmi.latestweight = assessmentArr[0].weight;
    memberbmi.bmi = analytics.calculateBMI(member.height, memberbmi.latestweight);
    memberbmi.bmiCategory = analytics.determineBMICategory(memberbmi.bmi);
    memberbmi.idealWeight = analytics.idealWeightIndicator(member.height, memberbmi.latestweight, member.gender);

    //populating the viewData variable with the nwecessary information to load the page
    const viewData = {
      title: 'Assessments',
      user: loggedInUser,
      member: member,
      assessments: assessmentArr,
      bmi: memberbmi,
    };
    
    logger.info('about to render', viewData.title);
    response.render('trainerassess', viewData);
  },

  addGoal(request, response) {

    const userId = request.params.id;

    const newGoal = {
      id: uuid(),
      goal: request.body.goal,
      date: request.body.date + ' ' + request.body.month,
    };

    logger.debug('New Goal = ', newGoal);
    goalStore.addGoal(userId, newGoal);
    response.redirect('/dashboard/');
  },

  deleteGoal(request, response) {
    const userId = request.params.id;
    const goalId = request.params.goalid;
    logger.debug(`Deleting Song ${goalId} from Member ${userId}`);
    goalStore.removeGoal(userId, goalId);
    response.redirect('/dashboard/');
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
