// jscs:disable disallowKeywordsOnNewLine
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
    logger.info('about to render', viewData.classList);
    response.render('classes', viewData);
  },

  fullEnroll(request, response) {

    let userId = accounts.getCurrentUser(request).id;
    let classId = request.params.id;
    let memberArr = classStore.getClassList(classId)[0];
    let memberArr1 = classStore.getClassList(classId)[0].members;
    let memberArr2 = classStore.getClassList(classId)[0].memberList;
    let memberArr3 = classStore.getClassList(classId)[0].id;
    if (userId) {

      logger.info('Enrolling: ', memberArr);
      response.redirect('/dashboard');
    }
    else {
      response.redirect('/classes');
    }

  },
};

module.exports = classes;
