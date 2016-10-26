 const questions = require('../questions/encuesta1');
 const responses = require('../responses/generate');


 exports.seed = function (knex, user) {
   return knex('surveys').insert({
     user_id: user.id,
     title: 'Encuesta 1',
     is_active: true,
   }).returning('*')
     .then((survey) => {
       return questions.seed(knex, survey[0])
         .then(() => {
           return responses.seed(knex, survey[0]);
         });
     });
 };
