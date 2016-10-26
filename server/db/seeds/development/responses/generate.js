// responses/generate.js

const answers = require('../answers/generate');

exports.seed = function (knex, survey) {
  const promises = [];
  for (let i = 0; i < 200; i++) {
    const q1 = createResponse(knex, survey);
    promises.push(q1);
  }

  return Promise.all(promises);
};

function createResponse(knex, survey) {
  const macaddress = Math.random().toString(8).substring(2, 4);
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));

  return knex.table('response').insert({
    survey_id: survey.id,
    macaddress,
    created_at: date,
  }).returning('*')
    .then((response) => {
      return answers.seed(knex, survey, response[0]);
    });
}
