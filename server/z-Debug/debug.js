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

const array = [
  [-2209075200000, "14"],
  [-2209071600000, "22"],
  [-2209068000000, "19"],
  [-2209064400000, "26"],
  [-2209060800000, "19"],
  [-2209057200000, "25"],
  [-2209053600000, "44"],
  [-2209050000000, "29"],
  [-2209046400000, "21"],
  [-2209042800000, "20"],
  [-2209039200000, "29"],
  [-2209035600000, "17"],
  [-2209032000000, "20"],
  [-2209028400000, "27"],
  [-2209024800000, "21"],
  [-2209021200000, "23"],
  [-2209017600000, "20"],
  [-2209014000000, "21"],
  [-2209010400000, "17"],
  [-2209006800000, "26"],
  [-2209003200000, "23"],
  [-2208999600000, "20"],
  [-2208996000000, "13"],
  [-2208992400000, "23"]
];

for (var i = 0; i < array.length; i++) {
  console.log(new Date(array[i][0]).getUTCHours());
  console.log(new Date(array[i][0]).getHours());

}
