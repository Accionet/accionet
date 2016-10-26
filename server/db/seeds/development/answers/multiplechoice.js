exports.seed = function (knex, response, question) {
  return knex('options').select('*').where('question_id', question.id)
    .then((options) => {
      const selectedOption = options[Math.floor(Math.random() * options.length)];
      return knex('answer').insert({
        response_id: response.id,
        question_id: question.id,
        answer_option_id: selectedOption.id,
        created_at: response.created_at,
      });
    });
};
