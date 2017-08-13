'use strict';

const classes = require('../models/class-store');
const uuid = require('uuid');
const logger = require('../utils/logger');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const classes = classes.getAllClasses(request);
    const viewData = {
      title: 'Classes',
      user: classes,
    };
    logger.info('about to render', classes);
    response.render('classes', viewData);
  },
};

module.exports = classes;
