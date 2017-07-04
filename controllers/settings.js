'use strict';

const accounts = require ('./accounts.js');
const uuid = require('uuid');
const logger = require('../utils/logger');
const playlistStore = require('../models/playlist-store');

const settings = {
  index(request, response) {
    logger.info('settings rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Profile Settings',
      playlists: playlistStore.getUserPlaylists(loggedInUser.id),
      user: loggedInUser,
    };
    logger.info('about to render', playlistStore.getAllPlaylists());
    response.render('settings', viewData);
  },
  
  updateSettings(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newSettings = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.title,
      songs: [],
    };
    logger.debug('Updating Profile Settings', newSettings);
    //playlistStore.addPlaylist(newPlayList);
    response.redirect('/settings');
  },
  
  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect('/dashboard/');
  },
};

module.exports = settings;
