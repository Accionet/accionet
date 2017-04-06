/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');
const Place = require('../newModels/places');
const Answer = require('../models/answer');
const Survey = require('../models/surveys');

const AnswerMetric = require('../models/metrics/answerMetric');
const knex = require('../db/knex');
const utils = require('../services/utils');
const cmd = require('node-cmd');

const visit = require('../models/visits');




Survey.filterColumns(['id', 'title', ]).then((entries) =>{
  console.log(entries);
}).catch((err) =>{
  console.log(err);
})
