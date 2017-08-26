// jscs:disable disallowKeywordsOnNewLine
'use strict';

const classStore = require('../models/class-store');
const pictureStore = require('../models/picture-store');
const accounts = require('./accounts.js');
const logger = require('../utils/logger');
const _ = require('lodash');
const HandlebarHelper = require('../utils/handlebarsRegisterHelper.js');

const classes = {
  index(request, response) {

    let loggedInUser = accounts.getCurrentUser(request);

    logger.info('classes rendering');
    const viewData = {
      title: 'Classes',
      user: loggedInUser,
      classList: classStore.getAllClasses(),
      imgs: pictureStore.getAlbum('qad52697-6d98-4d80-8273-084de55a86c0'),
    };
    logger.info('about to render', viewData.title);
    response.render('classes', viewData);
  },

  /**
   * To enroll a member in all possible classes
   * @param request
   * @param response
   */
  fullEnroll(request, response) {
    let user = accounts.getCurrentUser(request);
    let userid = user.id;
    let classArr = classStore.getClassList(request.params.classid)[0];
    let lessonList = classArr.lessonList;

    //To check if user isn't a trainer
    if (!user.trainer) {
      //a for each loop to go through the individual lessons and add the user to each lesson
      for (let i = 0; i < lessonList.length; i++) {
        let memberList = lessonList[i].memberList;

        //Checks to make sure user's id isn't already stored for that particular lesson and that lesson isn't fully booked
        if (memberList.indexOf(userid) < 0 && (memberList.length < classArr.maxMembers)) {
          memberList.push(userid);
          classStore.store.save();
          logger.info('Member added to lesson: ', lessonList[i].lessonid);
        }

        //will return a message stating that particular class is full
        else if (!(memberList.length < classArr.maxMembers)) {
          logger.info('Lesson is full: ', lessonList[i].lessonid);
        }

        //This is to help prevent potential bugs if a member signs up for a certain class and chooses to fully enroll later
        else if (!(memberList.indexOf(userid) < 0)) {
          logger.info('Member already in lesson: ', lessonList[i].lessonid);
        }
      }

      logger.info('Enrolling: ', user.trainer);
    }
    else {
      logger.info('Class is full or user is a trainer: ');
    }

    response.redirect('/classes');
  },

  /**
   * To unenroll a member from every lesson in a class
   * @param request
   * @param response
   */
  fullUnenroll(request, response) {
    let user = accounts.getCurrentUser(request);
    let userid = user.id;
    let classArr = classStore.getClassList(request.params.classid)[0];
    let lessonList = classArr.lessonList;

    for (let i = 0; i < lessonList.length; i++) {
      let memberList = lessonList[i].memberList;

      let memberIndex = memberList.indexOf(userid);
      if (memberIndex >= 0) {
        classStore.removeMember(memberIndex, memberList);
        logger.info('Removing from : ', memberList);
      }
    }
    response.redirect('/classes');
  },

  unenroll(request, response) {
    let userid = accounts.getCurrentUser(request).id;
    let lessonList = classStore.getClassList(request.params.classid)[0].lessonList;
    let memberList = _.filter(lessonList, { lessonid: request.params.lessonid })[0].memberList;
    let memberIndex = memberList.indexOf(userid);

    classStore.removeMember(memberIndex, memberList);
    logger.info('Lodash: ', userid);
    response.redirect('/classes');
  },

  enroll(request, response){
    let userid = accounts.getCurrentUser(request).id;
    let classArr = classStore.getClassList(request.params.classid)[0];
    let memberList = _.filter(classArr.lessonList, { lessonid: request.params.lessonid })[0].memberList;

    if (memberList.indexOf(userid) < 0){

      logger.info('Member to be added to lesson: ', memberList);
      memberList.push(userid);
      classStore.store.save();
      logger.info('Member added to lesson: ', memberList);
      classStore.store.save();
    }

    response.redirect('/classes');
  }
};

module.exports = classes;
