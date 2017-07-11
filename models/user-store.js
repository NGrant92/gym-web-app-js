'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const analytics = require('../utils/analytics.js');
const cloudinary = require('cloudinary');
const path = require('path');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  addPicture(userId, imageFile, response) {
    const env = require('../.data/.env.json');
    cloudinary.config(env.cloudinary);
    
    let currPic = this.getUserById(userId).img;
    
    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          const img = result.url;
  
          const femaleFlex = 'http://res.cloudinary.com/ngrant/image/upload/v1499768660/woman-flex_nttlf7.jpg';
          const maleFlex = 'http://res.cloudinary.com/ngrant/image/upload/v1499768660/arnold-flex_mk0w3g.jpg';
          if (currPic !== femaleFlex && currPic !== maleFlex) {
            const oldPic = path.parse(currPic);
            cloudinary.v2.uploader.destroy([oldPic.name], function (result) {
              console.log(result);
            });
          }
  
          this.getUserById(userId).img = img;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = userStore;
