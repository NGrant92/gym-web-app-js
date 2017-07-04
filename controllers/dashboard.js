'use strict';

const accounts = require ('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const playlistStore = require('../models/goal-store');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Playlist Dashboard',
      goals: goalStore.getUserGoalList(loggedInUser.id),
      user: loggedInUser,
    };
    logger.info('about to render', goalStore.getAllGoalLists());
    response.render('dashboard', viewData);
  },
  
  addGoals(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newGoal = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.title,
      goals: [],
    };
    logger.debug('Creating a new Playlist', newGoal);
    goalStore.addGoal(newGoal);
    response.redirect('/dashboard');
  },
  
  addGoal(request, response) {
    const goalsId = request.params.id;
    const goals = goalStore.getGoalList(goalsId);
    const newGoal = {
      id: uuid(),
      goal: request.body.goal,
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
