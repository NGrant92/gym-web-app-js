// jscs:disable disallowKeywordsOnNewLine
'use strict';// jscs:ignore validateLineBreaks
const accounts = require('./accounts.js');
const uuid = require('uuid');
const _ = require('lodash');
const logger = require('../utils/logger');
const userStore = require('../models/user-store');

const bookings = {

  addBookingIndex(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let userArr = [];
    let viewData = [];

    if (loggedInUser.trainer) {
      viewData = {
        title: 'Booking',
        user: loggedInUser,
        booking: _.find(loggedInUser.bookings, { bookid: request.params.bookid }),
        members: userStore.getAllMembers(),
      };
    }
    else {
      viewData = {
        title: 'Booking',
        member: loggedInUser,
        booking: _.find(loggedInUser.bookings, { bookid: request.params.bookid }),
        trainerList: userStore.getAllTrainers(),
      };
    }

    logger.info('ID: ', request.params.bookid);
    response.render('addbooking', viewData);
  },

  editBookingIndex(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let userArr = [];

    if (loggedInUser.trainer) {
      userArr =  userStore.getAllMembers();
    }
    else {
      userArr = userStore.getAllTrainers();
    }

    const viewData = {
      title: 'Edit Booking',
      user: loggedInUser,
      booking: _.find(loggedInUser.bookings, { bookid: request.params.bookid }),
      userList: userArr,
    };

    logger.info('ID: ', request.params.bookid);
    response.render('editbooking', viewData);
  },

  bookAssessment(request, response) {
    let trainer = [];
    let member = [];
    const bookDate = new Date(request.body.bookDate + ' ' + request.body.bookTime);
    logger.info(`bookDate`, bookDate);
    logger.info(`bookDate`, request.body.bookDate);
    logger.info(`bookTime`, request.body.bookTime);

    if (userStore.getUserById(request.params.id).trainer === true) {
      member = userStore.getUserById(request.body.bookedMember);
      trainer = userStore.getUserById(request.params.id);
    } else if (userStore.getUserById(request.params.id).trainer === false) {
      member = userStore.getUserById(request.params.id);
      trainer = userStore.getUserById(request.body.bookedTrainer);
    }

    const newTrainerBooking = {
      bookid: uuid(),
      date: bookDate,
      memberid: member.id,
      memberName: member.firstname + ' ' + member.lastname,
    };

    userStore.addBooking(trainer, newTrainerBooking);
    logger.info(`newTrainerBooking`, newTrainerBooking);

    const newMemberBooking = {
      bookid: uuid(),
      date: bookDate,
      trainerid: trainer.id,
      trainerName: trainer.firstname + ' ' + trainer.lastname,
    };
    userStore.addBooking(member, newMemberBooking);
    userStore.store.save();
    logger.info(`newMemberBooking`, newMemberBooking);
    logger.info(`Assessment Booked. Reloading to dashboard`, member.bookings);
    response.redirect('/dashboard/');
  },

  remBooking(request, response) {
    const user = accounts.getCurrentUser(request);
    const bookedUser = userStore.getUserById(request.params.bookedid);
    const bookingid = request.params.bookid;
    let bookingDate = '';

    for (let i = 0; i < user.bookings.length; i++) {
      if (user.bookings[i].bookid === bookingid) {
        logger.info('Removing booking from user: ', user.bookings[i]);
        bookingDate = user.bookings[i].date;
        _.pullAt(user.bookings, i);
      }
    }

    for (let k = 0; k < bookedUser.bookings.length; k++) {
      if (bookedUser.bookings[k].date === bookingDate) {
        logger.info('Removing booking from bookedUser: ', bookedUser.bookings[k]);
        _.pullAt(bookedUser.bookings, k);
      }
    }

    userStore.store.save();
    logger.info('Booking removes from users');
    response.redirect('/dashboard/');
  },

  setBooking(request, response) {
    let member = [];
    let trainer = [];
    let memberBooking = [];
    let trainerBooking = [];
    const newBookDate = new Date(request.body.bookDate + ' ' + request.body.bookTime);

    if (userStore.getUserById(request.params.id).trainer === true) {
      trainer = userStore.getUserById(request.params.id);
      member = userStore.getUserById(request.body.bookedMember);
      trainerBooking = _.find(trainer.bookings, { bookid: request.params.bookid });
      memberBooking = _.find(member.bookings, { date: trainerBooking.date });
    }
    else if (userStore.getUserById(request.params.id).trainer === false) {
      member = userStore.getUserById(request.params.id);
      trainer = userStore.getUserById(request.body.bookedTrainer);
      memberBooking = _.find(member.bookings, { bookid: request.params.bookid });
      trainerBooking = _.find(trainer.bookings, { date: memberBooking.date });
    }

    memberBooking.date = newBookDate;
    trainerBooking.date = newBookDate;

    userStore.store.save();

    response.redirect('/dashboard/');
  },
};

module.exports = bookings;
