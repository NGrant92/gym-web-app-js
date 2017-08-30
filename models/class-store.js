'use strict';

const logger = require('../utils/logger');
const _ = require('lodash');
const JsonStore = require('./json-store');

const classStore = {

  store: new JsonStore('./models/class-store.json', { classCollection: [] }),
  collection: 'classCollection',



  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  getClass(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getClassList(classid) {
    return this.store.findBy(this.collection, { classid: classid });
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass);
    this.store.save();
  },

  removeClass(classid) {
    logger.debug(`member list: `, this.getClassList(classid)[0]);
    this.store.remove(this.collection, this.getClassList(classid)[0]);
    this.store.save();
  },

  removeMember(memberIndex, memberList) {

    logger.debug(`member list: `, memberList);
    _.pullAt(memberList, memberIndex);
    logger.debug(`new member list: `, memberList);
    this.store.save();
  },
};

module.exports = classStore;
