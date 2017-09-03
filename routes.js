'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const goals = require('./controllers/goals.js');
const about = require('./controllers/about.js');
const trainerboard = require('./controllers/trainerboard.js');
const trainerassess = require('./controllers/trainerassess.js');
const settings = require('./controllers/settings.js');
const classes = require('./controllers/classes.js');
const assessments = require('./controllers/assessments.js');
const bookings = require('./controllers/bookings.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/trainerboard', trainerboard.index);

router.get('/trainerassess/:memberid', trainerassess.index);
router.post('/trainerassess/setcomment/:memberid/:assessid', trainerassess.setComment);

router.get('/dashboard', dashboard.index);

router.get('/dashboard/:id/deletegoal/:goalid', goals.deleteGoal);
router.post('/dashboard/:id/addgoal', goals.addGoal);

router.post('/dashboard/:id/addassessment', assessments.addAssessment);
router.get('/dashboard/:id/deleteassessment/:assessid', assessments.deleteAssessment);

router.post('/dashboard/:id/bookassessment', bookings.bookAssessment);
router.get('/dashboard/:bookid/booking', bookings.bookingIndex);
router.post('/editbooking/:id/:bookid/setbooking', bookings.setBooking);
router.get('/dashboard/:bookid/:bookedid/rembooking', bookings.remBooking);

router.get('/about', about.index);

router.get('/classes', classes.index);
router.get('/classes/:classid/fullEnroll', classes.fullEnroll);
router.get('/classes/:classid/fullUnenroll', classes.fullUnenroll);
router.get('/classes/:classid/unenroll/:lessonid', classes.unenroll);
router.get('/classes/:classid/enroll/:lessonid', classes.enroll);
router.get('/classes/remClass/:classid', classes.remClass);
router.post('/classes/addClass', classes.addClass);

router.get('/settings', settings.index);
router.post('/settings/update', accounts.setAccount);
router.post('/settings/uploadpicture', accounts.uploadPicture);

module.exports = router;