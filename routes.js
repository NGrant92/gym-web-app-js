'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const trainerboard = require('./controllers/trainerboard.js');
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

router.get('/dashboard', dashboard.index);
router.get('/dashboard/:id/deletegoal/:goalid', dashboard.deleteGoal);
router.post('/dashboard/:id/addgoal', dashboard.addGoal);
router.post('/dashboard/:id/addassessment', dashboard.addAssessment);
router.get('/dashboard/:id/deleteassessment/:assessid', dashboard.deleteAssessment);

router.get('/about', about.index);

router.get('/classes', classes.index);
router.get('/classes/:classid/fullEnroll', classes.fullEnroll);

router.get('/settings', settings.index);
router.post('/settings/update', accounts.setAccount);
router.post('/settings/uploadpicture', accounts.uploadPicture);

module.exports = router;