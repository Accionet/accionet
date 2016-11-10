'use strict';
const Table = require('./table');
const utils = require('../services/utils');
// const Option = new Options();

// const Place = require('./places');


class Questions extends Table {

  constructor() {
    const table_name = 'questions';
    super(table_name);
  }


  save(attr) {
    const Option = require('./options'); // eslint-disable-line
    const question = utils.cloneObject(attr);
    return new Promise((resolve, reject) => {
      const options = question.options;
      // if it has valid options it shoul be an array
      if (options && !(options instanceof Array)) {
        reject('Options should be an array');
      }
      // delete question options so it does not complain that it has attributes it shoulnt
      delete question.options;
      super.save(question).then((question) => {
        if (options && options.length > 0) {
          const promises = [];
          for (let i = 0; i < options.length; i++) {
            options[i].question_id = question.id;
            promises.push(Option.save(options[i]));
          }
          const saveOption = Promise.all(promises);
          saveOption.then(() => {
            resolve(this.findById(question.id));
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(question);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  update(id, attr) {
    const Option = require('./options'); // eslint-disable-line
    return new Promise((resolve, reject) => {
      const question = utils.cloneObject(attr);
      const options = question.options;
      // if it has valid options it shoul be an array
      if (options && !(options instanceof Array)) {
        reject('Options should be an array');
      }
      // delete question options so it does not complain that it has attributes it shoulnt
      delete question.options;
      super.update(id, question).then((question) => {
        if (options && options.length > 0) {
          question.options = options;
          Option.updateOptionsOfQuestion(question).then(() => {
            resolve(this.findById(question.id));
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(question);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updateQuestionsOfSurvey(survey) {
    const Survey = require('./surveys'); // eslint-disable-line global-require

    return new Promise((resolve, reject) => {
      // Check for valid parameters
      if (!survey || !survey.id) {
        reject('La pregunta es inválida. No tiene el atributo id');
      }
      const newQuestions = survey.questions;
      if (!newQuestions || !(newQuestions instanceof Array)) {
        reject('La pregunta es inválida. Las opciones no están definidas correctamente');
      }
      //
      Survey.findById(survey.id).then((beforeSurvey) => {
        if (!survey) {
          return reject('La pregunta no existe');
        }

        const beforeQuestions = beforeSurvey.questions;
        const questionsToCreate = [];
        const questionsToDelete = [];
        const questionsToUpdate = [];

        // Delete and update the ones that actually exists
        for (let i = 0; i < beforeQuestions.length; i++) {
          let survives = false;
          for (let j = 0; j < newQuestions.length; j++) {
            if (beforeQuestions[i].id === newQuestions[j].id) {
              survives = true;
              questionsToUpdate.push(this.update(newQuestions[j].id, newQuestions[j]));
              break;
            }
          }

          if (!survives) {
            questionsToDelete.push(this.delete(beforeQuestions[i].id));
          }
        }
        const updatesPromise = Promise.all(questionsToUpdate);
        const deletePromise = Promise.all(questionsToDelete);
        const updateDeletePromise = Promise.all([updatesPromise, deletePromise]);
        for (let j = 0; j < newQuestions.length; j++) {
          let create = true;
          for (let i = 0; i < beforeQuestions.length; i++) {
            if (newQuestions[j].id === beforeQuestions[i].id) {
              create = false;
              break;
            }
          }
          if (create) {
            newQuestions[j].survey_id = beforeSurvey.id;

            questionsToCreate.push(this.save(newQuestions[j]));
          }
        }
        const newPromise = Promise.all(questionsToCreate);
        const allPromises = Promise.all([newPromise, updateDeletePromise]);

        allPromises.then(() => {
          // Return all the questions of the survey
          Survey.findById(beforeSurvey.id).then((modifiedSurvey) => {
            resolve(modifiedSurvey);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseToSend(question) {
    const Option = require('./options'); // eslint-disable-line

    return new Promise((resolve, reject) => {
      Option.find({
        question_id: question.id,
      }).then((options) => {
        question.options = options;
        resolve(question);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new Questions();

module.exports = instance;
