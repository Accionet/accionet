var Places = require('../models/places.js');
var Surveys = require('../models/surveys.js');
var Questions = require('../models/questions.js');
var Response = require('../models/response.js');
var Answer = require('../models/answer.js');




Answer.findOfSurvey(2, function(err, result) {
    if (err) {
        console.error(err);
        return err;
    }
    console.log("-----------------");
    console.log(result);

})
