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
};

module.exports = classStore;
