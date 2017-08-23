'use strict';

const Handlebars = require('handlebars');

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('subtract', function (num1, num2) {
  return num1 - num2;
});

module.exports = Handlebars;
