'use strict';

const userstore = require('../models/user-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    const password = user.password === request.body.password;

    if (password) {
      response.cookie('playlist', user.id);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      response.redirect('/login');
    }
  },
  
  getCurrentUser(request) {
    const userId = request.cookies.playlist;
    return userstore.getUserById(userId);
  },
  
  setAccount(request, response){
    let user = accounts.getCurrentUser(request);
    const newUser = request.body;
  
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.email = newUser.email;
    user.address = newUser.address;
    user.password = newUser.password;
    user.gender = newUser.gender;
    user.height = newUser.height;
    user.weight = newUser.weight;
    
    logger.info(`updating ${newUser.email}`);
    response.redirect('/dashboard');
  },
};

module.exports = accounts;