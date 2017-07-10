'use strict';

const userstore = require('../models/user-store');
const goalStore = require('../models/goal-store');
const picturestore = require('../models/picture-store');
const assessStore = require('../models/assess-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const dateformat = require('dateformat');

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
    const newUserId = uuid();
    let profilePic = '';

    user.trainer = false;
    user.id = newUserId;
    user.startWeight = user.weight;
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);

    if (user.gender === 'Male') {
      profilePic = 'http://res.cloudinary.com/ngrant/image/upload/v1499434484/arnold-flex_tgsq0c.png';
    }
    else {
      profilePic = 'http://res.cloudinary.com/ngrant/image/upload/v1499434950/woman-flex_h0wqgi.jpg';
    }

    picturestore.addPicture(newUserId, profilePic);
    logger.info(`adding default profile pic`);

    const newGoalList = {
      id: uuid(),
      userid: newUserId,
      goals: [],
    };
    logger.info('Creating a new Goal List', newGoalList);
    goalStore.addGoalList(newGoalList);

    const newAssessList = {
      userid: newUserId,
      assessments: [{
        id: uuid(),
        date: dateformat(new Date(), 'dd-mm-yyyy'),
        weight: user.weight,
      },
      ],
    };
    logger.info('Creating new Assessment List', newAssessList);
    assessStore.addAssessmentList(newAssessList);

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

  setAccount(request, response) {
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
