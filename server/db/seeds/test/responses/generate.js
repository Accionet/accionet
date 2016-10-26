const multiplechoice = require('../answers/multiplechoice');


exports.seed = function (knex, survey) {
  return knex('questions').select('*').where('survey_id', survey.id)
    .then((questions) => {
      for (let i = 0; i < 200; i++) {
        const macaddress = Math.random().toString(8).substring(2, 4);
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        date.setHours(date.getHours() - Math.floor(Math.random() * 24));
        knex('response').insert({
          survey_id: survey.id,
          macaddress,
          created_at: date,
        }).returning('*')
          .then((response) => {
            for (let i = 0; i < questions.length; i++) {
              if (questions[i].type === 'multiple_choice') {
                multiplechoice.seed(knex, response[0], questions[i]);
              }
            }
          });
      }
    });
};
