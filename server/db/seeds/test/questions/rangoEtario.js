const optionsQ1 = require('../options/rangoEtarioQ1');
const optionsQ2 = require('../options/rangoEtarioQ2');
const optionsQ3 = require('../options/rangoEtarioQ3');


exports.seed = function (knex, survey) {
  return knex('questions').insert({
    survey_id: survey.id,
    title: '¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta',
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
        title: 'Que numero te gusta mas?',
        type: 'multiple_choice',
        number: 3,
      }).returning('*')
        .then((q3) => {
          return optionsQ3.seed(knex, q3[0]);
        });
    });
};
