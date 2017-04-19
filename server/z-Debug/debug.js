/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';


const Place = require('../models/places');
const Answer = require('../models/answer');
const User = require('../models/users');

const Survey = require('../models/surveys');

const AnswerMetric = require('../models/metrics/answerMetric');
const knex = require('../db/knex');
const utils = require('../services/utils');
const cmd = require('node-cmd');

const Visit = require('../models/visits');

const userController = require('../controllers/userController');


const d = new Date();

Visit.byHour({
  place_id: 4556,
}, 60).then((withOffset) => {
  console.log('--------------CON OFFSET-------------------');

  for (var i = 0; i < withOffset.length; i++) {
    console.log(new Date(withOffset[i][0]).getHours() + " " + withOffset[i][1]);
  }
  console.log('--------------CON OFFSET-------------------');

}).catch((error) => {
console.log(error);});


Visit.byHour({
  place_id: 4556,
}).then((withOffset) => {
  console.log('--------------SIN OFFSET-------------------');
  for (var i = 0; i < withOffset.length; i++) {
    console.log(new Date(withOffset[i][0]).getHours() + " " + withOffset[i][1]);
  }
  console.log('--------------SIN OFFSET-------------------');

}).catch((error) => {
console.log(error);});
