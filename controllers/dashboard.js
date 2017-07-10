'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const pictureStore = require('../models/picture-store.js');
const assessStore = require('../models/assess-store.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Dashboard',
      goallist: goalStore.getUserGoalList(loggedInUser.id),
      user: loggedInUser,
      profilepic: pictureStore.getPicture(loggedInUser.id).img,
      assessments: assessStore.getUserAssessmentList(loggedInUser.id)[0].assessments.reverse(),
    };
    logger.info('about to render', viewData.assessments);
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

    const userId = request.params.id;

    const dateformat = require('dateformat');

    const newAssess = {
      id: uuid(),
      date: dateformat(new Date(), 'dd-mm-yyyy'),
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
