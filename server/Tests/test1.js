'use strict';

const Places = require('../models/places');
const Surveys = require('../models/surveys');
const Questions = require('../models/questions');
const Response = require('../models/response');
const Answer = require('../models/answer');
const Visits = require('../models/visit');


Visits.tableDateAndHour({
    place_id: 1,
}, (err, daily) => {
    if (err) {
        return console.error(err);
    }
    console.log(daily);
});
