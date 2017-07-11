'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const assessmentArr = assessStore.getUserAssessmentList(loggedInUser.id)[0].assessments;
  
    //This sort function is used to sort the assessments by date in descending order
    assessmentArr.sort(function (a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      return dateB - dateA;
    });
    
    //Updating the user's weight with their most recent assessment weight measurement
    //It's done here so it'll update when an assessment is added OR deleted
    loggedInUser.weight = assessmentArr[0].weight;
    
    //Adding new keys into the logged in user and giving the apropriate values
    //determined by the calcualtions done by analytics.js
    loggedInUser.bmi = analytics.calculateBMI(loggedInUser.height, loggedInUser.weight);
    loggedInUser.bmiCategory = analytics.determineBMICategory(loggedInUser.bmi);
    loggedInUser.idealWeight = analytics.idealWeightIndicator(loggedInUser);

    //populating the viewData variable with the necessary information to load the page
    const viewData = {
      title: 'Dashboard',
      goallist: goalStore.getUserGoalList(loggedInUser.id),
      user: loggedInUser,
      assessments: assessmentArr,
    };
    
    logger.info('about to render', viewData);
    response.render('dashboard', viewData);
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

  addAssessment(request, response) {

    const loggedInUser = accounts.getCurrentUser(request);
    const userId = request.params.id;

    const newAssess = {
      id: uuid(),
      date: dateformat(new Date(), 'dd-mm-yy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      comment: '',
    };

    logger.debug('New Assessment: ', newAssess);
    assessStore.addAssessment(userId, newAssess);
    response.redirect('/dashboard/');
  },

  deleteAssessment(request, response) {
    const userId = request.params.id;
    const assessId = request.params.assessid;
    logger.debug(`Deleting Assessment ${assessId} from Member ${userId}`);
    assessStore.removeAssessment(userId, assessId);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
