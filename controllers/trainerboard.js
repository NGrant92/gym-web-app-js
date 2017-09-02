'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const assessStore = require('../models/assess-store.js');
const pictureStore = require('../models/picture-store.js');
const userStore = require('../models/user-store');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');
const dateSort = require('../utils/dateSort.js');

const trainerboard = {
  
  index(request, response) {
    //logger.debug('beginning of dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);

    let members = userStore.getAllMembers();

    //for each loop to get the number of assessments which will be displayed on trainer board
    for (let singleKey in members) {
      members[singleKey].assessmentSize = assessStore.getUserAssessmentList(members[singleKey].id)[0].assessments.length;
    }

    loggedInUser.bookings = dateSort.sortByOldest(loggedInUser.bookings);

    //populating the viewData variable with the necessary information to load the page
    const viewData = {
      title: 'Trainer Dashboard',
      user: loggedInUser,
      members: members,
      stockAlbum: pictureStore.getStockAlbum().album,
    };
    
    logger.info('about to render', viewData.title);
    response.render('trainerboard', viewData);
  },
};

module.exports = trainerboard;
