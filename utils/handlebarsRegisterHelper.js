'use strict';

const Handlebars = require('handlebars');

  Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

module.exports = Handlebars;
