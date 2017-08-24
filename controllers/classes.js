// jscs:disable disallowKeywordsOnNewLine
'use strict';

const classStore = require('../models/class-store');
const pictureStore = require('../models/picture-store');
const accounts = require('./accounts.js');
const logger = require('../utils/logger');
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

  fullEnroll(request, response) {
    let user = accounts.getCurrentUser(request);
    let userid = user.id;
    let classArr = classStore.getClassList(request.params.classid)[0];
    let lessonList = classArr.lessonList;

    //To check if class isn't full or user isn't a trainer
    if (classArr.maxMembers - classArr.currMembers !== 0 || !user.trainer) {
      let memberCount = 0;

      for (let i = 0; i < lessonList.length; i++) {
        for (let k = 0; k < lessonList[i].memberList.length; k++) {
          if (memberList[k].userid === user.id) {
            logger.info('Member already enrolled');
            response.redirect('/classes');
          }
        }
      }

      //a for each loop to go through the individual lessons and add the user to each lesson
      for (let i = 0; i < lessonList.length; i++) {
        let memberList = lessonList[i].memberList;

        //Checks to make sure user's id isn't already stored for that particular lesson
        if (memberList.indexOf(userid) > 0) {
          memberList.push(userid);
          logger.info('Member added to lesson: ', lessonList.lessonid);
        }

        //This is to help prevent potential bugs if a member signs up for a certain class and chooses to fully enroll later
        else {
          memberCount++;
          logger.info('Member already in lesson: ', lessonList.lessonid);
        }
      }

      logger.info('Enrolling: ', user.trainer);
    }
    else {
      logger.info('Class is full or user is a trainer: ');
    }

    response.redirect('/classes');
  },
};

module.exports = classes;
