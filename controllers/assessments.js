// jscs:disable disallowKeywordsOnNewLine
'use strict';// jscs:ignore validateLineBreaks
const accounts = require('./accounts.js');
const uuid = require('uuid');
const _ = require('lodash');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const userStore = require('../models/user-store');
const assessStore = require('../models/assess-store.js');
const analytics = require('../utils/analytics.js');
const dateSort = require('../utils/dateSort.js');

const assessments = {

  addAssessment(request, response) {

    const userId = request.params.id;

    const newAssess = {
      id: uuid(),
      date: new Date(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      comment: '',
    };

    logger.debug('New Assessment: ', newAssess);
    assessStore.addAssessment(userId, newAssess);
    response.redirect('/dashboard/');
  },

  deleteAssessment(request, response) {
    const userId = request.params.id;
    const assessId = request.params.assessid;
    logger.debug(`Deleting Assessment ${assessId} from Member ${userId}`);
    assessStore.removeAssessment(userId, assessId);
    response.redirect('/dashboard/');
  },
};

module.exports = assessments;
