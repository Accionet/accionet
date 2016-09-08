 const Places = require('../models/places.js');
 const Surveys = require('../models/surveys.js');
 const Questions = require('../models/questions.js');
 const Response = require('../models/response.js');
 const Answer = require('../models/answer.js');


 Answer.findOfSurvey(2, function (err, result) {
   if (err) {
     console.error(err);
     return err;
   }
   console.log('-----------------');
   console.log(result);
 });
