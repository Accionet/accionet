// surveys/generate

// const questions = require('../questions/rangoEtario');
// const surveys = require('./samples');
//
//
// exports.seed = function (knex, Promise, user) {
//   const surveyPromises = [];
//   surveys[user.username].forEach((survey) => {
//     survey.user_id = user.id;
//     surveyPromises.push(createSurvey(knex, Promise, survey));
//   });
//   Promise.all(surveyPromises);
// };
//
//
// function createSurvey(knex, Promise, survey) {
//   return knex('surveys').insert(survey).returning('*')
//     .then((survey) => {
//       return questions.seed(knex, survey[0])
//         .then(() => {});
//     });
// }
