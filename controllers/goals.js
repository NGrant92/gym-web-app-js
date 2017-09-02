'use strict';

const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');

const goals = {

  addGoal(request, response) {

    const userId = request.params.id;

    const newGoal = {
      goalid: uuid(),
      goal: request.body.goal,
      date: new Date(request.body.goalDate),
    };

    logger.debug('New Goal = ', newGoal);
    goalStore.addGoal(userId, newGoal);
    goalStore.store.save();
    response.redirect('/dashboard/');
  },

  deleteGoal(request, response) {
    const userId = request.params.id;
    const goalId = request.params.goalid;
    logger.debug(`Deleting Song ${goalId} from Member ${userId}`);
    goalStore.removeGoal(userId, goalId);
    goalStore.store.save();
    response.redirect('/dashboard/');
  },
};

module.exports = goals;
