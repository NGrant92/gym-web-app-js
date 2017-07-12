'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');
const userStore = require('../models/user-store');
const Handlebars = require('handlebars');
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

const trainerboard = {
  
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);

    let members = userStore.getAllMembers();
    
    for(var singleKey in members){
      members[singleKey].assessmentSize = assessStore.getUserAssessmentList(members[singleKey].id).length;
    }
    
    //populating the viewData variable with the necessary information to load the page
    const viewData = {
      title: 'Dashboard',
      user: loggedInUser,
      members: userStore.getAllMembers(),
    };
    
    logger.info('about to render', viewData);
    response.render('trainerboard', viewData);
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

module.exports = trainerboard;
