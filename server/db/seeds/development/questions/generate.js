// questions/generate.js

// const options = require('../options/generate');

exports.seed = function (knex, survey, questions) {
  const promises = [];
  questions.forEach((question) => {
    question.survey_id = survey.id;
    const q1 = createSurvey(knex, question);
    promises.push(q1);
  });
  return Promise.all(promises);
};

function createSurvey(knex, question) {
  return knex.table('questions').insert(question).returning('*')
    .then((question) => {
      // return options.seed(knex, question);
    });
}
