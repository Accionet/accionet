// questions/generate.js

const options = require('../options/generate');

exports.seed = function (knex, survey, questions) {
  const promises = [];
  questions.forEach((question) => {
    question.survey_id = survey.id;
    const q1 = createQuestion(knex, question);
    promises.push(q1);
  });
  return Promise.all(promises);
};


function createQuestion(knex, question) {
  const optionsOfQuestion = getOptions(question);
  delete question.options;
  return knex.table('questions').insert(question).returning('*')
    .then((question) => {
      return options.seed(knex, question[0], optionsOfQuestion);
    });
}

function getOptions(question) {
  if (question.options) {
    return question.options;
  }
  return [];
}
