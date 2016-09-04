var Places = require('../models/places.js');
var Surveys = require('../models/surveys.js');
var Questions = require('../models/questions.js');
var Response = require('../models/response.js');


var response = {
    survey_id: 2,
    answers: [{
        question_id: 3,
        answer_option_id: 4
    }]
};

Response.save(response, function(err, result) {
    if (err) {
        console.error(err);
        return err;
    }
    console.log("-----------------");
    console.log(result);

})
