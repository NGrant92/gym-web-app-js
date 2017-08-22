'use strict';

const Handlebars = require('handlebars');

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('subtract', function (num1, num2) {
  return num1 - num2;
});

Handlebars.registerHelper('isFull', function (num1, num2) {
  //let isFull = '';
  let enrollButton = document.createElement('BUTTON');
  let numSum = 0;

  if (numSum === 0) {
    //isFull = '<button class="ui red disabled button"> Full </button>';
    enrollButton.className = 'ui red disabled button';
    enrollButton.textContent = 'Full';

    document.body.appendChild(enrollButton);

  } else {
    enrollButton.className = 'ui red disabled button';
    enrollButton.textContent = 'Enroll';
  }

  return isFull;

});

Handlebars.registerHelper('classColor', function (num1, num2) {
  let color = 'blue';
  let numSum = num1 - num2;

  if (numSum === 0) {
    color = 'red';
  } else {
    color = 'blue';
  }

  return color;
});

module.exports = Handlebars;
