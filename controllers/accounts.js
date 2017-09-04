'use strict';

const userstore = require('../models/user-store');
const goalStore = require('../models/goal-store');
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
    response.cookie('user', '');
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

    //a for each loop to ensure an email only belongs to one account
    for (let i = 0; i < userstore.length; i++) {
      if (userstore[i].email === user.email) {
        logger.info('Email already registered: ', user.email);
        response.redirect('/');
      }
    }

    user.trainer = false;
    user.id = newUserId;
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);

    if (user.gender === 'Male') {
      user.img = 'http://res.cloudinary.com/ngrant/image/upload/v1499768660/arnold-flex_mk0w3g.jpg';
    }
    else {
      user.img = 'http://res.cloudinary.com/ngrant/image/upload/v1499768660/woman-flex_nttlf7.jpg';
    }

    const newGoalList = {
      userid: newUserId,
      goals: [],
    };
    logger.info('Creating a new Goal List', newGoalList);
    goalStore.addGoalList(newGoalList);

    const newAssessList = {
      userid: newUserId,
      assessments: [
        {
          id: uuid(),
          date: dateformat(new Date(), 'dd-mm-yy'),
          weight: user.startWeight,
          chest: 0,
          thigh: 0,
          upperArm: 0,
          waist: 0,
          hips: 0,
        },
      ],
    };
    logger.info('Creating new Assessment List', newAssessList);
    assessStore.addAssessmentList(newAssessList);

    userstore.store.save();
    goalStore.store.save();
    assessStore.store.save();

    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);

    if (user && user.password === request.body.password) {
      response.cookie('user', user.id);
      logger.info(`logging in ${user.email}`);

      if (user.trainer === true) {
        response.redirect('/trainerboard');
      } else {
        response.redirect('/dashboard');
      }

    } else {
      response.redirect('/login/');
    }
  },

  getCurrentUser(request) {
    const userId = request.cookies.user;
    return userstore.getUserById(userId);
  },

  setAccount(request, response) {
    let user = accounts.getCurrentUser(request);
    const newUser = request.body;

    user.firstname = newUser.firstname;
    user.lastname = newUser.lastname;
    user.email = newUser.email;
    user.address = newUser.address;
    user.password = newUser.password;
    user.gender = newUser.gender;
    user.height = newUser.height;

    userstore.store.save();
    logger.info(`updating ${newUser.email}`);
    response.redirect('/dashboard');
  },

  uploadPicture(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    userstore.addPicture(loggedInUser.id, request.files.picture, function () {
      response.redirect('/settings/');
    });
  },
};

module.exports = accounts;
