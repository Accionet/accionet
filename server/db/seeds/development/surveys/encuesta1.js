 const encuesta1Questions = require('../questions/encuesta1');


 exports.seed = function (knex, user) {
   return knex('surveys').insert({
     user_id: user.id,
     title: 'Encuesta 1',
     is_active: true,
   }).returning('*')
    .then((survey) => {
      return encuesta1Questions.seed(knex, survey[0]);
    });
 };
