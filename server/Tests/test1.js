var Places = require('../models/places.js');
var Surveys = require('../models/surveys.js');
var Questions = require('../models/questions.js');


Surveys.all(function(err, surveys) {

  if(err){
    console.log(err);
    return err;
  }

  console.log(surveys);

});
