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

  addGoalList(goal) {
    this.store.add(this.collection, goal);
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

  removeGoal(id, goalId) {
    const goalList = this.getGoalList(id);
    const goals = goalList.goals;
    _.remove(goals, { id: goalId });
    this.store.save();
  },
};

module.exports = goalStore;