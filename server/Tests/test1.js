var Places = require('../models/places.js');
var Surveys = require('../models/surveys.js');
var Questions = require('../models/questions.js');


Surveys.all(function(err, surveys) {

  if(err){
    console.log(err);
    return err;
  }
console.log(("******************************************"));

   for (var i = 0; i < surveys.length; i++) {
     console.log("------------------------------");
     console.log(surveys[i]);
     console.log();
     console.log('Questions');
     for (var j = 0; j < surveys[i].questions.length; j++) {
       console.log(surveys[i].questions[j]);
       console.log();
       console.log('Opciones');
       for (var k = 0; k < surveys[i].questions[j].options.length; k++) {
         console.log(surveys[i].questions[j].options[k]);
       }
       console.log('fin Opciones');

     }
     console.log('fin Questions');
   }
   console.log(surveys[0].questions[0]);
   console.log();

});
