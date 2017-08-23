'use strict';

const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');

const goals = {

  index(request, response) {
    const goalId = request.params.id;
    logger.debug('Playlist id = ', goalId);
    const viewData = {
      title: 'Goals',
      goalList: goalStore.getGoalList(goalId),
    };
    response.render('goal', viewData);
  },

  deleteGoal(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Playlist ${playlistId}`);
    playlistStore.removeSong(playlistId, songId);
    response.redirect('/playlist/' + playlistId);
  },

  addGoal(request, response) {
    const goalId = request.params.id;
    const newGoal = {
      id: uuid(),
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };

    logger.debug('New Goall: ', newGoal);
    goalStore.addGoal(goalId, newGoal);
    response.redirect('/playlist/' + playlistId);
  },
};

module.exports = goals;
