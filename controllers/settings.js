'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const pictureStore = require('../models/picture-store.js');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Profile Settings',
      user: loggedInUser,
      profilepic: pictureStore.getPicture(loggedInUser.id).img,
    };
    logger.info('about to render', loggedInUser);
    response.render('settings', viewData);
  },
};

module.exports = settings;
