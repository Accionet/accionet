'use strict';

const Places = require('../models/places');
const Surveys = require('../models/surveys');
const Questions = require('../models/questions');
const Response = require('../models/response');
const Answer = require('../models/answer');


const date = new Date(null, null, null, 1);
console.log(date);
console.log(date.getYear());
console.log(date.getHours());
console.log(date.getMinutes());
console.log(date.getSeconds());

Response.metricsByHour({
    survey_id: 2,
}, (err, result) => {
    if (err) {
        console.log('ERROR');
        return console.log(err);
    }
    console.log('resultados');
    console.log(result);
});
