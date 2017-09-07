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

  removeLesson(lessonIndex, lessonList){
    logger.debug('old lesson list', lessonList);
    _.pullAt(lessonList, lessonIndex);
    logger.debug(`new lesson list: `, lessonList);
    this.store.save();
  },

  searchClasses(searchbar, difficulty){
    const classList = this.getAllClasses();
    let classesFound = [];

    for (let i = 0; i < classList.length; i++) {
      if (classList[i].name.toLowerCase().indexOf(searchbar.toLowerCase()) >= 0) {
        logger.debug('searchbar = true');
        if(difficulty === '' || difficulty === classList[i].difficulty){
          logger.debug('difficulty = true');
          classesFound.push(classList[i]);
        }
      }
    }

    logger.debug(classesFound);
    return classesFound;
  }
};

module.exports = classStore;
