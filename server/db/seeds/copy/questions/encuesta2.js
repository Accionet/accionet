const optionsQ1 = require('../options/encuesta2Q1');
const optionsQ2 = require('../options/encuesta2Q2');
const optionsQ3 = require('../options/encuesta2Q3');
const optionsQ4 = require('../options/encuesta2Q4');


exports.seed = function (knex, survey) {
  return knex('questions').insert({
    survey_id: survey.id,
    title: 'Pregunta 1',
    type: 'multiple_choice',
    number: 1,
  }).returning('*')
    .then((q1) => {
      return optionsQ1.seed(knex, q1[0]);
    })
    .then(() => {
      return knex('questions').insert({
        survey_id: survey.id,
        title: 'Eres hombre?',
        type: 'multiple_choice',
        number: 2,
      }).returning('*')
        .then((q2) => {
          return optionsQ2.seed(knex, q2[0]);
        });
    })
    .then(() => {
      return knex('questions').insert({
        survey_id: survey.id,
        title: 'Hola?',
        type: 'multiple_choice',
        number: 3,
      }).returning('*')
        .then((q3) => {
          return optionsQ3.seed(knex, q3[0]);
        });
    })
    .then(() => {
      return knex('questions').insert({
        survey_id: survey.id,
        title: 'Que nombre te gusta mas?',
        type: 'multiple_choice',
        number: 4,
      }).returning('*')
        .then((q4) => {
          return optionsQ4.seed(knex, q4[0]);
        });
    });
};
