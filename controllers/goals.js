// jscs:disable disallowKeywordsOnNewLine
'use strict';

const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');
const accounts = require('./accounts.js');

const goals = {

  addGoal(request, response) {

    const memberId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);

    const newGoal = {
      goalid: uuid(),
      date: new Date(request.body.goalDate).toISOString(),
      status: 'ongoing',
      assessment: {
        weight: request.body.goalWeight,
        chest: request.body.goalChest,
        thigh: request.body.goalThigh,
        upperArm: request.body.goalUpperArm,
        waist: request.body.goalWaist,
        hips: request.body.goalHips,
        comment: request.body.goalComment,
        date: new Date(request.body.goalDate).toISOString(),
      },
    };

    logger.debug('New Goal: ', newGoal);
    goalStore.addGoal(memberId, newGoal);

    if (loggedInUser.trainer) {
      response.redirect(`/trainerassess/${memberId}`);
    }
    else {
      response.redirect('/dashboard/');
    }
  },

  deleteGoal(request, response) {
    const memberId = request.params.id;
    const goalId = request.params.goalid;
    const loggedInUser = accounts.getCurrentUser(request);

    logger.debug(`Deleting Song ${goalId} from Member ${memberId}`);

    goalStore.removeGoal(memberId, goalId);

    if (loggedInUser.trainer) {
      response.redirect(`/trainerassess/${memberId}`);
    }
    else {
      response.redirect('/dashboard/');
    }
  },
};

module.exports = goals;
