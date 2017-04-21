// surveys/generate.js

const surveys = require('./samples');
const questions = require('../questions/generate');
const responses = require('../responses/generate');

exports.seed = function (knex, user) {
  const surveysToAdd = surveys[user.username];
  const promises = [];
  surveysToAdd.forEach((survey) => {
    const q1 = createSurvey(knex, survey);
    promises.push(q1);
  });
  return Promise.all(promises);
};

function createSurvey(knex, survey) {
  const questionsOfSurvey = getQuestions(survey);
  delete survey.questions;
  return knex.table('surveys').insert(survey).returning('*')
    .then((survey) => {
      return questions.seed(knex, survey[0], questionsOfSurvey)
        .then(() => {
          return responses.seed(knex, survey[0]);
        });
    });
}

function getQuestions(survey) {
  if (survey.questions) {
    return survey.questions;
  }
  return [];
}
