'use strict';

const classStore = require('../models/class-store');
const pictureStore = require('../models/picture-store');
const accounts = require('./accounts.js');
const logger = require('../utils/logger');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');

const classes = {
  index(request, response) {

    let loggedInUser = accounts.getCurrentUser(request);

    logger.info('classes rendering');
    const viewData = {
      title: 'Classes',
      user: loggedInUser,
      classList: classStore.getAllClasses(),
      imgs: pictureStore.getAlbum('qad52697-6d98-4d80-8273-084de55a86c0'),
    };
    logger.info('about to render', viewData);
    response.render('classes', viewData);
  },

  fullEnroll(request, response) {

    let loggedInUser = accounts.getCurrentUser(request);

    if(loggedInUser.id === '3ad52697-6d98-4d80-8273-084de55a86c0'){
      response.redirect('/dashboard');
    }
    else{
      response.redirect('/classes');
    }

  },
};

module.exports = classes;
