// exports.seed = function (knex) {
//   return knex('users').del() // Deletes ALL existing entries
//     .then(() => ( // Inserts seed entries one by one in series
//       knex('users').insert({
//         username: 'accionet',
//         password: 'accionet159',
//         email: 'antonio@accionet.cl',
//         is_admin: true,
//         is_active: true,
//       }).returning('*')))
//     .then((user) => (
//       knex('surveys').insert({
//         user_id: user.id,
//         title: 'Rango Etario Streetpark',
//         is_active: true,
//       }).returning('*')))
//     .then((survey) => (
//       knex('questions').insert({
//         survey_id: survey.id,
//         title: '¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta',
//         type: 'multiple_choice',
//         number: 1,
//       }).returning('*')))
//     .then((question) => {
//       addOptionToQuestion({
//         statement: '10 años o menor',
//         enumeration: 'a',
//       }, question, knex);
//     });
// };
//
//
// function addOptionToQuestion(option, question, knex) {
//   knex('options').insert({
//     question_id: question.id,
//     statement: option.statement,
//     enumeration: option.enumeration,
//   });
// }
//
// // function addSurveyToUser(survey, user, knex) {
// //   return knex('surveys').insert({
// //     user_id: user.id,
// //     title: survey.title,
// //     is_active: survey.is_active,
// //   }).returning('*')))
// //
// // }
