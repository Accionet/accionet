/* eslint-disable */
'use strict';
// process.env.NODE_ENV = 'test';


// const Place = require('../models/places');
// const Answer = require('../models/answer');
// const User = require('../models/users');
// const Access = require('../models/access');
//
//
// const Survey = require('../models/surveys');
//
// const AnswerMetric = require('../models/metrics/answerMetric');
// const knex = require('../db/knex');
// const utils = require('../services/utils');
// const cmd = require('node-cmd');
//
// const Visit = require('../models/visits');
//
// const hotspotCotroller = require('../controllers/hotspotController');


const d = new Date();



var string = "jo\njo"
function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}

// var json = '{"hola": "meneh \n hont"}';
string = jsonEscape(string)

// console.log(JSON.parse(json));
console.log(string);
