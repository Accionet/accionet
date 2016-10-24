 const questions = require('../questions/rangoEtario');


 exports.seed = function (knex, user) {
   return knex('surveys').insert({
     user_id: user.id,
     title: 'Rango Etario Streetpark',
     is_active: true,
   }).returning('*')
    .then((survey) => {
      return questions.seed(knex, survey[0]);
    });
 };
