'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const analytics = require('../utils/analytics.js');
const cloudinary = require('cloudinary');

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
    
    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          const img = result.url;
          
          this.getUserById(userId).img = img;
          this.store.save();
          response();
        });
      }
    });
  },
};

module.exports = userStore;
