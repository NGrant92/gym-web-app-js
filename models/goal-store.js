'use strict';

const logger = require('../utils/logger');
const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  store: new JsonStore('./models/goal-store.json', { goalCollection: [] }),
  collection: 'goalCollection',

  getAllGoalLists() {
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
    this.store.remove(this.collection, this.getUserGoalList(id));
    //this.store.save();
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
    _.remove(goals, { goalid: goalId });
    this.store.save();
  },
};

module.exports = goalStore;
