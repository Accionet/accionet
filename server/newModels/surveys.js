const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars

const utils = require('../services/utils');

class Surveys extends Activatable {

  constructor() {
    const table_name = 'surveys';
    super(table_name);
  }

  save(attr) {
    const Question = require('./questions'); // eslint-disable-line
    const survey = utils.cloneObject(attr);
    return new Promise((resolve, reject) => {
      const questions = survey.questions;
      // if it has valid questions it shoul be an array
      if (questions && !(questions instanceof Array)) {
        reject('Questions should be an array');
      }
      // delete survey questions so it does not complain that it has attributes it shoulnt
      delete survey.questions;
      super.save(survey).then((survey) => {
        if (questions && questions.length > 0) {
          const promises = [];
          for (let i = 0; i < questions.length; i++) {
            questions[i].survey_id = survey.id;
            promises.push(Question.save(questions[i]));
          }
          const saveQuestion = Promise.all(promises);
          saveQuestion.then(() => {
            resolve(this.findById(survey.id));
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(survey);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseToSend(survey) {
    const Question = require('./questions'); // eslint-disable-line

    return new Promise((resolve, reject) => {
      Question.find({
        survey_id: survey.id,
      }).then((questions) => {
        survey.questions = questions;
        resolve(survey);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new Surveys();

module.exports = instance;
