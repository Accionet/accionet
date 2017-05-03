/* eslint-disable */
'use strict';
// process.env.NODE_ENV = 'test';


const Place = require('../models/places');
const Answer = require('../models/answer');
const User = require('../models/users');
const Access = require('../models/access');


const Survey = require('../models/surveys');

const AnswerMetric = require('../models/metrics/answerMetric');
const knex = require('../db/knex');
const utils = require('../services/utils');
const cmd = require('node-cmd');

const Visit = require('../models/visits');

const userController = require('../controllers/userController');


const d = new Date();


// console.log('\x1b[36m%s\x1b[0m', 'ii', '\x1b[36m%s\x1b[0mfff/', '1234');  //cyan


const user = {}

user.username = 'accionet2';
user.password = 'accionet159';
user.is_admin = true;
user.email = 'contacto@accionet.cl';
User.save(user).then((savedUser) => {
  console.log(savedUser);
}).catch((err) => {
  console.log(err);
});
