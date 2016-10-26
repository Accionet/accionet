const questions = require('../questions/encuesta2');


exports.seed = function (knex, user) {
  return knex('surveys').insert({
    user_id: user.id,
    title: 'Encuesta 2',
    is_active: true,
  }).returning('*')
    .then((survey) => {
      return questions.seed(knex, survey[0]);
    });
};
