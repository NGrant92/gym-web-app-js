'use strict';// jscs:ignore validateLineBreaks
const accounts = require('./accounts.js');
const uuid = require('uuid');
const _ = require('lodash');
const dateformat = require('dateformat');
const logger = require('../utils/logger');
const goalStore = require('../models/goal-store');
const userStore = require('../models/user-store');
const assessStore = require('../models/assess-store.js');
const classStore = require('../models/class-store.js');
const analytics = require('../utils/analytics.js');

const dashboard = {
  index(request, response) {

    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const userbmi = [];

    //if the user is a trainer then it'll redirect to the trainer dashboard
    if (loggedInUser.trainer === true) {
      logger.info('user is a trainer');
      response.redirect('/trainerboard');
    }

    //'else' is required to prevent a "Cannot read property 'assessments' of undefined" error message
    else {
      logger.info('user is a member');
      const assessmentArr = assessStore.getUserAssessmentList(loggedInUser.id)[0].assessments;

      //This sort function is used to sort the assessments by date in descending order
      assessmentArr.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB - dateA;
      });

      //bmi information of the member, determined by the calcualtions done by analytics.js
      userbmi.latestweight = assessmentArr[0].weight;
      userbmi.bmi = analytics.calculateBMI(loggedInUser.height, userbmi.latestweight);
      userbmi.bmiCategory = analytics.determineBMICategory(userbmi.bmi);
      userbmi.idealWeight = analytics.idealWeightIndicator(loggedInUser.height, userbmi.latestweight, loggedInUser.gender);

      //populating the viewData variable with the necessary information to load the page
      const viewData = {
        title: 'Dashboard',
        goallist: goalStore.getUserGoalList(loggedInUser.id),
        member: loggedInUser,
        bmi: userbmi,
        assessments: assessmentArr,
        classes: classStore,
        trainerList: userStore.getAllTrainers(),
      };

      logger.info('about to render', viewData.title);
      response.render('dashboard', viewData);
    }
  },

  addGoal(request, response) {

    const userId = request.params.id;

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

  addAssessment(request, response) {

    const loggedInUser = accounts.getCurrentUser(request);
    const userId = request.params.id;

    const newAssess = {
      id: uuid(),
      date: dateformat(new Date(), 'dd-mm-yy'),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      comment: '',
    };

    logger.debug('New Assessment: ', newAssess);
    assessStore.addAssessment(userId, newAssess);
    response.redirect('/dashboard/');
  },

  deleteAssessment(request, response) {
    const userId = request.params.id;
    const assessId = request.params.assessid;
    logger.debug(`Deleting Assessment ${assessId} from Member ${userId}`);
    assessStore.removeAssessment(userId, assessId);
    response.redirect('/dashboard/');
  },

  bookAssessment(request, response) {
    let trainer = [];
    let member = [];
    const bookDate = new Date(request.body.bookDate + ' ' + request.body.bookTime);

    if (userStore.getUserById(request.params.id).trainer === true) {
      member = userStore.getUserById(request.body.bookedMember);
      trainer = userStore.getUserById(request.params.id);
    } else if (userStore.getUserById(request.params.id).trainer === false) {
      member = userStore.getUserById(request.params.id);
      trainer = userStore.getUserById(request.body.bookedTrainer);
    }

    const newTrainerBooking = {
      date: bookDate,
      memberid: member.id,
      memberName: member.firstname + ' ' + member.lastname,
    };
    trainer.bookings.push(newTrainerBooking);

    const newMemberBooking = {
      date: bookDate,
      trainerid: trainer.id,
      trainerName: trainer.firstname + ' ' + trainer.lastname,
    };
    member.bookings.push(newMemberBooking);

    userStore.store.save();

    logger.info(`Assessment Booked. Reloading to dashboard`, member.bookings);
    dashboard.index(request, response);
  },

  remBooking(request, response) {

    response.redirect('/dashboard/');
  },

  bookingIndex(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const editBooking = _.find(loggedInUser.bookings, { date: request.params.date });

    const viewData = {
      title: 'Edit Booking',
      member: loggedInUser,
      booking: editBooking,
      trainerList: userStore.getAllTrainers(),
    };

    logger.info('viewData: ', viewData);
    response.render('editbooking', viewData);
  },

  setBooking(request, response) {

    response.redirect('/dashboard/');
  },
};

module.exports = dashboard;
