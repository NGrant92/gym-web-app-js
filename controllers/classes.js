'use strict';

const classStore = require('../models/class-store');
const pictureStore = require('../models/picture-store');
const logger = require('../utils/logger');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');

const classes = {
  index(request, response) {

    logger.info('classes rendering');
    const viewData = {
      title: 'Classes',
      classList: classStore.getAllClasses(),
      imgs: pictureStore.getAlbum('qad52697-6d98-4d80-8273-084de55a86c0'),
    };
    logger.info('about to render', viewData.classList);
    response.render('classes', viewData);
  },
};

module.exports = classes;
