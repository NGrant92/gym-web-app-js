'use strict';

const classStore = require('../models/class-store');
const logger = require('../utils/logger');

const classes = {
  index(request, response) {
    logger.info('classes rendering');
    const viewData = {
      title: 'Classes',
      classList: classStore.getAllClasses(),
    };
    logger.info('about to render', viewData.classList);
    response.render('classes', viewData);
  },
};

module.exports = classes;
