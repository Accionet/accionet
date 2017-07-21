/* eslint-disable */
'use strict';
// process.env.NODE_ENV = 'test';


// const Place = require('../models/places');
// const Answer = require('../models/answer');
// const User = require('../models/users');
// const Access = require('../models/access');
//
//
const Person = require('../models/person');
//
// const AnswerMetric = require('../models/metrics/answerMetric');
// const knex = require('../db/knex');
// const utils = require('../services/utils');
// const cmd = require('node-cmd');
//
// const Visit = require('../models/visits');
//
// const hotspotCotroller = require('../controllers/hotspotController');
const knex = require('../db/knex');


Person.findByFBId(3);
// knex('person').select('*').where(knex.raw("facebook->>'id' = ?", [3])).then((v) =>{
//   console.log(v);
// }).catch((err) =>{
//   console.log(err);
// })
