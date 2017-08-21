'use strict';

const Handlebars = require('handlebars');

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('subtract', function (num1, num2) {
  return num1 - num2;
});

Handlebars.registerHelper('enrollClass', function (num1, num2) {
  let isFull = '';
  let numSum = num1 - num2;

  if (numSum === 0) {
    isFull = 'Full';
  } else {
    isFull = 'Enroll';
  }

  return isFull;

});

Handlebars.registerHelper('classColor', function (num1, num2) {
  let color = 'blue';
  let numSum = num1 - num2;

  return color;
});

module.exports = Handlebars;
