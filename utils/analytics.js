// jscs:disable disallowKeywordsOnNewLine
'use strict';

const _ = require('lodash');
const logger = require('../utils/logger');

const analytics = {

  /**
   * A method used to check a member's array of goals and check their ongoing or pending goals
   *
   * @param goals The array list of goals to be checked
   * @param lastAssessment Member's most recent assessment
   */
  checkGoalStatus(goals, lastAssessment) {

    let today = new Date();
    let isRecentAssess = false;

    //An if statement to check if member's most recent assessment is no more than 3 days old
    if (lastAssessment.date >= today.setDate(today.getDate() - 3)) {
      isRecentAssess = true;
    }

    //a for each loop to go through the goals object
    for (let singleKey in goals) {

      let currGoal = goals[singleKey];

      //checking if the goal status is tagged 'ongoing' and if it's the day of or days after the stored date
      if (currGoal.status === 'ongoing' && currGoal.date <= new Date().toISOString()) {

        //if there is no assessment made in the last 3 days it'll set the goal status to pending
        if (!isRecentAssess) {
          currGoal.status = 'pending';
        }

        //if there is a recent assessment then it'll check if the assessment achieved
        //otherwise status is set to missed
        else if (_.isEqual(lastAssessment, currGoal.assessment)) {
          currGoal.status = 'achieved';
        }
        else {
          currGoal.status = 'missed';
        }
      }

      //checking if a goal status is set to 'pending' and there is a recent assessment
      else if (currGoal.status === 'pending' && isRecentAssess) {

        //checking if the recent assessment matches the goal's assessment
        //otherwise status is set to missed
        if (_.isEqual(lastAssessment, currGoal.assessment)) {
          currGoal.status = 'achieved';
        }
        else {
          currGoal.status = 'missed';
        }
      }
    }

    //returning the processed array
    return goals;
  },

  /**
   * This method calculate the BMI value for the member. BMI = KG x (Height x Height)
   *
   * @return the BMI value for the member. The number returned is truncated to two decimal places.
   */
  calculateBMI(height, weight) {
    return (weight / (height * height)).toFixed(2);
  },

  /**
   * This method determines the BMI category that the member belongs to.
   * The category is determined by the magnitude of the members BMI according to the following:
   *
   * BMI less than    15   (exclusive)                      is "VERY SEVERLY UNDERWEIGHT"
   * BMI between      15   (inclusive) and 16   (exclusive) is "SEVERELY UNDERWEIGHT"
   * BMI between      16   (inclusive) and 18.5 (exclusive) is "UNDERWEIGHT"
   * BMI between      18.5 (inclusive) and 25   (exclusive) is "NORMAL"
   * BMI between      25   (inclusive) and 30   (exclusive) is "OVERWEIGHT"
   * BMI between      30   (inclusive) and 35   (exclusive) is "MODERATELY OBESE"
   * BMI between      35   (inclusive) and 40   (exclusive) is "SEVERELY OBESE"
   * BMI greater than 40   (inclusive)                      is "VERY SEVERELY OBESE"
   *
   * @return the format of a String is similar to (note the double quotes around the category): "NORMAL".
   */
  determineBMICategory(bmiValue) {
    let bmiResult;

    if (bmiValue < 15) {
      bmiResult = 'VERY SEVERELY UNDERWEIGHT';
    }
    else if (bmiValue >= 15 && bmiValue < 16) {
      bmiResult = 'SEVERELY UNDERWEIGHT';
    }
    else if (bmiValue >= 16 && bmiValue < 18.5) {
      bmiResult = 'UNDERWEIGHT';
    }
    else if (bmiValue >= 18.5 && bmiValue < 25) {
      bmiResult = 'NORMAL';
    }
    else if (bmiValue >= 25 && bmiValue < 30) {
      bmiResult = 'OVERWEIGHT';
    }
    else if (bmiValue >= 30 && bmiValue < 35) {
      bmiResult = 'MODERATELY OBESE';
    }
    else if (bmiValue >= 35 && bmiValue < 40) {
      bmiResult = 'SEVERELY OBESE';
    }
    else if (bmiValue >= 40) {
      bmiResult = 'VERY SEVERELY OBESE';
    }
    else {
      bmiResult = 'Invalid result';
    }

    return bmiResult;
  },
  
  /**
   * This method returns a boolean to indicate if the member has an ideal body weight based on the
   * Devine formula.
   * men: kg = 50 + 2.3kg per inch over 5ft
   * women: kg = 45.5 + 2.3kg per inch over 5ft
   *
   * @return The ideal weight value that the member should be at
   */
  isIdealBodyWeight(height, gender) {

    const heightInches = this.convertMetresToInches(height);
    let idealWeight;
    
    if (heightInches <= 60) {
      
      if (gender === 'Male') {
        idealWeight = 50.0;
      }
      else {
        idealWeight = 45.5;
      }
    }
    else if (gender === 'Male') {
      idealWeight = 50 + (2.3 * (heightInches - 60));
    }
    else if (gender === 'Female') {
      idealWeight = 45.5 + (2.3 * (heightInches - 60));
    }
    
    return idealWeight;
  },
  
  /**
   * Returns a string with a colour to be used in the dashboard for ideal weight indicator
   * @return String with a colour in it
   */
  idealWeightIndicator(height, weight, gender) {
  
    //calculates what the ideal body weight should be for the member
    const idealWeight = this.isIdealBodyWeight(height, gender);
  
    //if member weight is within a certain range it will return a certain colour
    if (idealWeight >= (weight - 2) && idealWeight <= (weight + 2)) {
      return 'green';
    }
    else if (idealWeight >= (weight - 5) && idealWeight <= (weight + 5)) {
      return 'orange';
    }
    else {
      return 'red';
    }
  },
  
  /**
   * This method returns the member height converted from KGs to pounds.
   *
   * @return member weight converted from KGs to pounds. Number returned is truncated to 2 decimal places.
   */
  convertKGtoPounds(weight) {
    return (weight * 2.2).toFixed(2);
  },
  
  /**
   * This method returns the member height converted from metres to inches.
   *
   * @return member height converted from meters to inches using the formula: metres x 39.37.
   *          The number returned is truncated to 2 decimal places.
   */
  convertMetresToInches(height) {
    return (height * 39.37).toFixed(2);
  },
};

module.exports = analytics;
