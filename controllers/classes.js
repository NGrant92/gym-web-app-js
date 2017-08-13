'use strict';

const classStore = require('../models/class-store');
const uuid = require('uuid');
const logger = require('../utils/logger');

const classes = {
  index(request, response) {
    logger.info('classes rendering');
    const classes = classStore.getAllClasses(request);
    const viewData = {
      title: 'Classes',
      user: classes,
    };
    logger.info('about to render', classes);
    response.render('classes', viewData);
  },
};

module.exports = classes;
