// jscs:disable disallowKeywordsOnNewLine
'use strict';

const classStore = require('../models/class-store');
const pictureStore = require('../models/picture-store');
const accounts = require('./accounts.js');
const logger = require('../utils/logger');
const dateformat = require('dateformat');;
const uuid = require('uuid');
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

  editClassIndex(request, response) {

    let loggedInUser = accounts.getCurrentUser(request);

    const viewData = {
      title: 'Edit Class',
      user: loggedInUser,
      class: classStore.getClassList(request.params.classid)[0],
      imgs: pictureStore.getAlbum('qad52697-6d98-4d80-8273-084de55a86c0'),
      stockAlbum: pictureStore.getStockAlbum().album,
    };
    logger.info('about to render', viewData.title);
    response.render('editclass', viewData);
  },

  /**
   * A method that will process and sort information from the form a trainer has used to create a new class
   * @param request
   * @param response
   */
  addClass(request, response) {

    //putting the days the trainer selected into an array to be used later
    const lessonDays = request.body.days.toString().split(',');
    let startDate = new Date(request.body.startDate).toISOString();
    let endDate = new Date(request.body.endDate).toISOString();

    //new class array that will be added to the class store
    const newClass = {
      classid: uuid(),
      name: request.body.className,
      duration: '',
      startDate: startDate,
      endDate: endDate,
      startTime: request.body.startTime,
      endTime: request.body.endTime,
      maxMembers: request.body.maxMembers,
      bio: request.body.bio,
      difficulty: request.body.difficulty,
      days: [],
      img: request.body.image,
      lessonList: [],
    };

    //appending the duration value with the correct unit
    //if it's less than an hour then durHour information will not be added
    if (request.body.durHours >= 1) {
      newClass.duration = request.body.durHours + 'hr';
    }

    //appending duration value with minutes. If 0 mins then it wont be added
    if (request.body.durMins > 0) {
      newClass.duration = newClass.duration + request.body.durMins + 'mins';
    }

    logger.info('newClass.duration is populated: ', newClass.duration);

    //creating a "00:00 - 00:00 dddd" format and pushing it to 'days[]'
    for (let singleKey in lessonDays) {
      newClass.days.push(lessonDays[singleKey]);
    }

    logger.info('newClass.days[] is populated: ', newClass.days);

    //today's date to be used to help create objects to populate the lessonList
    let lessonDate = new Date(startDate);
    logger.debug('new lesson date ', lessonDate);
    logger.debug('Start date ', startDate);
    logger.debug('End date ', endDate);

    //a while loop to create an object for each individual lesson
    while (lessonDate <= new Date(endDate)) {

      //it's checking if the day of lessonDate matches the days input by the user
      if (lessonDays.indexOf(dateformat(lessonDate, 'dddd')) >= 0) {

        //creation and population of new object
        let newLesson = {

          lessonid: uuid(),
          date: lessonDate.toISOString(),
          memberList: [],
        };

        //adding new object to lessonList array
        newClass.lessonList.push(newLesson);
        logger.info('Added new lesson: ', newLesson);
      }

      //incrementing the lesson date and will keep happening until end date is reached
      lessonDate.setDate(lessonDate.getDate() + 1);
      logger.debug('lessonDate++ ', lessonDate);
    }

    logger.info('New Class:', newClass);
    classStore.addClass(newClass);
    response.redirect('/trainerboard/');
  },

  /**
   * A basic method to remove a class from the class store
   * @param request used to get the class ID
   * @param response will redirect to the classes index page
   */
  setClass(request, response) {
    const oldClass = classStore.getClassList(request.params.classid)[0];
    const newClass = {

      name: request.body.name,
      difficulty: request.body.difficulty,
      maxMembers: request.body.maxMembers,
      hours: request.body.durHours,
      mins: request.body.durMins,
      startTime: request.body.startTime,
      endTime: request.body.endTime,
      days: request.body.days,
      bio: request.body.bio,
      img: request.body.image,
    };

    oldClass.name = request.body.name;

    const newDifficulty = request.body.difficulty;
    if(newDifficulty.length > 0 && !newDifficulty === oldClass.difficulty){
      oldClass.difficulty = newDifficulty;
    }




    oldClass.name = request.body.name;
    oldClass.name = request.body.name;
    oldClass.name = request.body.name;
    oldClass.name = request.body.name;


    logger.debug('Setting Class: ', oldClass);
    response.redirect('/classes');
  },

  /**
   * A basic method to remove a class from the class store
   * @param request used to get the class ID
   * @param response will redirect to the classes index page
   */
  remClass(request, response) {
    const classid = request.params.classid;
    logger.info('Removing Class: ', classid);
    classStore.removeClass(classid);
    response.redirect('/classes');
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
    logger.info('Lodash: ', memberList);
    response.redirect('/classes');
  },

  enroll(request, response) {
    let userid = accounts.getCurrentUser(request).id;
    let classArr = classStore.getClassList(request.params.classid)[0];
    let memberList = _.filter(classArr.lessonList, { lessonid: request.params.lessonid })[0].memberList;

    if (memberList.indexOf(userid) < 0) {

      memberList.push(userid);
      logger.info('Member added to lesson: ', memberList);
      classStore.store.save();
    }

    response.redirect('/classes');
  },
};

module.exports = classes;
