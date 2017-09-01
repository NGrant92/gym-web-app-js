'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const trainerboard = require('./controllers/trainerboard.js');
const trainerassess = require('./controllers/trainerassess.js');
const settings = require('./controllers/settings.js');
const classes = require('./controllers/classes.js');

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
router.get('/dashboard/:id/deletegoal/:goalid', dashboard.deleteGoal);
router.post('/dashboard/:id/addgoal', dashboard.addGoal);
router.post('/dashboard/:id/addassessment', dashboard.addAssessment);
router.get('/dashboard/:id/deleteassessment/:assessid', dashboard.deleteAssessment);
router.post('/dashboard/:id/bookassessment', dashboard.bookAssessment);
router.get('/dashboard/:date/booking', dashboard.bookingIndex);
router.post('/editbooking/:date/editbooking', dashboard.setBooking);
router.post('/dashboard/:date/rembooking', dashboard.remBooking);

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