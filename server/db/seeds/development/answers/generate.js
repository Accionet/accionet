// db/seeds/development/answers/generate.js

exports.seed = function (knex, survey, response) {
  return knex.table('questions').select('*').where({
    survey_id: survey.id,
  })
    .then((questions) => {
      const promises = [];
      questions.forEach((question) => {
        const q = createAnswer(knex, question, response);
        promises.push(q);
      });
      return Promise.all(promises);
    });
};


function createAnswer(knex, question, response) {
  switch (question.type) {
  case 'multiple_choice':
    return createMultipleChoice(knex, question, response);
  default:
    break;
  }
}


function createMultipleChoice(knex, question, response) {
  return knex.table('options').select('*').where({
    question_id: question.id,
  })
    .then((options) => {
      let selectedOption = options[Math.floor(Math.random() * options.length)];
      // if it doesnt have options, selectedOption will be undefined. in this case just make it empty
      if (!selectedOption) {
        selectedOption = {};
      }
      return knex('answer').insert({
        response_id: response.id,
        question_id: question.id,
        answer_option_id: selectedOption.id,
        created_at: response.created_at,
      });
    });
}
