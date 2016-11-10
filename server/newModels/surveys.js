const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars


class Surveys extends Activatable {

  constructor() {
    const table_name = 'surveys';
    super(table_name);
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
