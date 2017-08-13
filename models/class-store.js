'use strict';

const logger = require('../utils/logger');
const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  store: new JsonStore('./models/class-store.json', { classCollection: [] }),
  collection: 'goalCollection',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  getGoalList(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserGoalList(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  addGoalList(goalList) {
    this.store.add(this.collection, goalList);
    this.store.save();
  },

  removeGoalList(id) {
    const goal = this.getGoalList(id);
    this.store.remove(this.collection, goal);
    this.store.save();
  },

  removeAllGoals() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  addGoal(userId, newGoal) {
    const goalList = this.getUserGoalList(userId);
    logger.debug(`goalList `, goalList);
    goalList[0].goals.push(newGoal);
    this.store.save();
  },

  removeGoal(userId, goalId) {
    const goalList = this.getUserGoalList(userId);
    logger.debug(`goalList `, goalList);
    const goals = goalList[0].goals;
    _.remove(goals, { id: goalId });
    this.store.save();
  },
};

module.exports = goalStore;
