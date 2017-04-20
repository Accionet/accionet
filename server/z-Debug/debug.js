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
