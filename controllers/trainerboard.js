'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');
const userStore = require('../models/user-store');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');

const trainerboard = {
  
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);

    let members = userStore.getAllMembers();

    //for each loop to get the number of assessments which will be displayed on trainer board
    for (var singleKey in members) {
      members[singleKey].assessmentSize = assessStore.getUserAssessmentList(members[singleKey].id)[0].assessments.length;
    }
    
    //populating the viewData variable with the necessary information to load the page
    const viewData = {
      title: 'Dashboard',
      user: loggedInUser,
      members: members,
    };
    
    logger.info('about to render', viewData);
    response.render('trainerboard', viewData);
  },
};

module.exports = trainerboard;
