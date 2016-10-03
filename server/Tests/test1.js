 const Places = require('../models/places');
 const Surveys = require('../models/surveys');
 const Questions = require('../models/questions');
 const Response = require('../models/response');
 const Answer = require('../models/answer');


 Surveys.getMetrics(1, (err_find_survey, populatedSurvey) => {
     console.log(populatedSurvey);
 });
