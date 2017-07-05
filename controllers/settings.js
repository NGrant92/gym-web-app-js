'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const playlistStore = require('../models/goal-store');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Profile Settings',
      user: loggedInUser,
    };
    logger.info('about to render', playlistStore.getAllPlaylists());
    response.render('settings', viewData);
  },
};

module.exports = settings;
