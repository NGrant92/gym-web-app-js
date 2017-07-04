'use strict';

const accounts = require ('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const playlistStore = require('../models/playlist-store');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Profile Settings',
      playlists: playlistStore.getUserPlaylists(loggedInUser.id),
      user: loggedInUser,
    };
    logger.info('about to render', playlistStore.getAllPlaylists());
    response.render('settings', viewData);
  },
};

module.exports = settings;
