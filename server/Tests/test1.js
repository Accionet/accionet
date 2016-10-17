'use strict';

const Places = require('../models/places');
const Surveys = require('../models/surveys');
const Questions = require('../models/questions');
const Response = require('../models/response');
const Answer = require('../models/answer');
const Displayed = require('../models/displayed');


Displayed.tableDateAndHour({
    place_id: 1,
}, (err, daily) => {
    if (err) {
        return console.error(err);
    }
    console.log(daily);
});
