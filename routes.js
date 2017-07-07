'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const playlist = require('./controllers/goals.js');
const settings = require('./controllers/settings.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/dashboard', dashboard.index);
router.get('/dashboard/:id/deletegoal/:goalid', dashboard.deleteGoal);
router.post('/dashboard/:id/addgoal', dashboard.addGoal);

router.get('/about', about.index);

router.get('/settings', settings.index);
router.post('/settings/update', accounts.setAccount);

module.exports = router;