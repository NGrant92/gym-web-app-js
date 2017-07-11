'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const userstore = require('../models/user-store.js');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Profile Settings',
      user: loggedInUser,
    };
    logger.info('about to render', loggedInUser);
    response.render('settings', viewData);
  },
  
  uploadPicture(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    userstore.addPicture(loggedInUser.id, request.files.picture, function () {
      response.redirect('/settings/');
    });
  },
};

module.exports = settings;
