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
};

module.exports = settings;
