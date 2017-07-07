'use strict';

const accounts = require('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const pictureStore = require('../models/picture-store.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Dashboard',
      goallist: goalStore.getUserGoalList(loggedInUser.id),
      user: loggedInUser,
      profilepic: pictureStore.getAlbum(loggedInUser.id).photos[0].img,
    };
    logger.info('about to render', viewData);
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

    const userId = request.params.id;

    //const goals = goalStore.getUserGoalList(userId);
    const newGoal = {
      id: uuid(),
      goal: request.body.goal,
      date: request.body.date + ' ' + request.body.month,
    };

    logger.debug('New Goal = ', newGoal);
    goalStore.addGoal(userId, newGoal);
    response.redirect('/dashboard/');
  },

  deleteGoal(request, response) {
    const userId = request.params.id;
    const goalId = request.params.goalid;
    logger.debug(`Deleting Song ${goalId} from Member ${userId}`);
    goalStore.removeGoal(userId, goalId);
    response.redirect('/dashboard/');
  },

  deleteGoals(request, response) {
    const goalsId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    goalStore.removePlaylist(playlistId);
    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
