'use strict';

const logger = require('../utils/logger');
const _ = require('lodash');
const JsonStore = require('./json-store');

const assessStore = {

  store: new JsonStore('./models/assess-store.json', { assessmentCollection: [] }),
  collection: 'assessmentCollection',

  getAllAssessmentLists() {
    return this.store.findAll(this.collection);
  },

  getAssessmentList(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserAssessmentList(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  addAssessmentList(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessmentList(id) {
    this.store.remove(this.collection, this.getUserAssessmentList(id));
    //this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  addAssessment(userId, newAssess) {
    const assessmentArr = this.getUserAssessmentList(userId);
    logger.debug(`goalList `, assessmentArr);
    assessmentArr[0].assessments.push(newAssess);
    this.store.save();
  },

  removeAssessment(userId, assessId) {
    const assessmentArr = this.getUserAssessmentList(userId);
    logger.debug(`assessment list `, assessmentArr);
    const assessments = assessmentArr[0].assessments;
    logger.debug(`User assessments `, assessments);
    _.remove(assessments, { id: assessId });
    this.store.save();
  },
};

module.exports = assessStore;
