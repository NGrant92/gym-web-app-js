'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  store: new JsonStore('./models/goal-store.json', { goalsCollection: [] }),
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

  addGoal(id, goal) {
    const goalList = this.getGoalList(id);
    goalList.goals.push(goal);
    this.store.save();
  },

  removeSong(id, goalId) {
    const goalList = this.getGoalList(id);
    const goals = goalList.goals;
    _.remove(goals, { id: goalId });
    this.store.save();
  },
};

module.exports = goalStore;
