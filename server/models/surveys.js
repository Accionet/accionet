const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars
const AnswerMetric = require('./metrics/answerMetric');
const AccessibleDecorator = require('./decorators/Accessible');
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

  update(id, attr) {
    const Question = require('./questions'); // eslint-disable-line
    return new Promise((resolve, reject) => {
      const survey = utils.cloneObject(attr);
      const questions = survey.questions;
      // if it has valid questions it shoul be an array
      if (questions && !(questions instanceof Array)) {
        reject('Questions should be an array');
      }
      // delete survey questions so it does not complain that it has attributes it shoulnt
      delete survey.questions;
      super.update(id, survey).then((survey) => {
        if (questions && questions.length > 0) {
          survey.questions = questions;
          Question.updateQuestionsOfSurvey(survey).then(() => {
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

  metricOfQuestion(question) {
    return new Promise((resolve, reject) => {
      AnswerMetric.ofQuestion(question.id).then((metrics) => {
        question.metrics = metrics;
        resolve(question);
      }).catch((err) => {
        reject(err);
      });
    });
  }


  getMetrics(id) {
    return new Promise((resolve, reject) => {
      this.findById(id).then((survey) => {
        const promises = [];
        for (let i = 0; i < survey.questions.length; i++) {
          promises.push(this.metricOfQuestion(survey.questions[i]));
        }
        Promise.all(promises).then(() => {
          resolve(survey);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseToSend(survey, columns) {
    const Question = require('./questions'); // eslint-disable-line

    return new Promise((resolve, reject) => {
      /*
      If it does not specify anything for question, we dont look up question*/
      if (columns && (!columns[Question.table_name] || !(Question.table_name in columns))) {
        resolve(survey);
        return;
      }
      Question.find({
        survey_id: survey.id,
      }, columns).then((questions) => {
        survey.questions = questions;
        resolve(survey);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new Surveys();

// decorate
AccessibleDecorator.decorate(instance);

module.exports = instance;
