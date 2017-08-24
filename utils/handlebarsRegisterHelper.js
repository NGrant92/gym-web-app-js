'use strict';

const dateformat = require('dateformat');
const Handlebars = require('handlebars');

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

module.exports = Handlebars;
