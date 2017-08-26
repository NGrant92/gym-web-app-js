'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const cloudinary = require('cloudinary');
const path = require('path');
const logger = require('../utils/logger');

const pictureStore = {

    store: new JsonStore('./models/picture-store.json', { pictures: [] }),
    collection: 'pictures',

    getAlbum(userid) {
      return this.store.findOneBy(this.collection, { userid: userid });
    },

    addPicture(userId, title, imageFile, response) {
      let album = this.getAlbum(userId);
      if (!album) {
        album = {
            userid: userId,
            photos: [],
          };
        this.store.add(this.collection, album);
        this.store.save();
      }

      imageFile.mv('tempimage', err => {
          if (!err) {
            cloudinary.uploader.upload('tempimage', result => {
                console.log(result);
                const picture = {
                    img: result.url,
                    title: title,
                  };
                album.photos.push(picture);
                this.store.save();
                response();
              });
          }
        });
    },

    deletePicture(userId, image) {
      const id = path.parse(image);
      let album = this.getAlbum(userId);
      _.remove(album.photos, { img: image });
      this.store.save();
      cloudinary.api.delete_resources([id.name], function (result) {
          console.log(result);
        });
    },

    deleteAllPictures(userId) {
      let album = this.getAlbum(userId);
      if (album) {
        album.photos.forEach(photo => {
            const id = path.parse(photo.img);
            cloudinary.api.delete_resources([id.name], result => {
                console.log(result);
              });
          });
        this.store.remove(this.collection, album);
        this.store.save();
      }
    },
  };

module.exports = pictureStore;