'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Dashboard',
      goallist: goalStore.getUserGoalList(loggedInUser.id),
      user: loggedInUser,
    };
    logger.info('about to render', goalStore.getAllGoalLists());
    response.render('dashboard', viewData);
  },

  //TODO Remove and auto generate an empty array when a member registers
  addGoals(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newGoal = {
      id: uuid(),
      userid: loggedInUser.id,
      goals: [],
    };
    logger.debug('Creating a new Goal List', newGoal);
    goalStore.addGoalList(newGoal);
    response.redirect('/dashboard');
  },

  addGoal(request, response) {
    const goalsId = request.params.id;
    //const goals = goalStore.getGoalList(goalsId);
    const newGoal = {
      id: uuid(),
      goal: request.body.goal,
      date: request.body.date + ' ' + request.body.month,
    };

    logger.debug('New Goal = ', newGoal);
    goalStore.addGoal(goalsId, newGoal);
    response.redirect('/dashboard/' + goalsId);
  },

  deleteGoals(request, response) {
    const goalsId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    goalStore.removePlaylist(playlistId);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
