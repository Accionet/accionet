'use strict';

const Table = require('./test_table'); // eslint-disabled-this-line no-unused-vars


class Options extends Table {

  constructor() {
    const table_name = 'options';
    super(table_name);
  }

  updateOptionsOfQuestion(question) {
    const Question = require('./test_questions'); // eslint-disable-line
    return new Promise((resolve, reject) => {
      if (!question || !question.id) {
        reject('La pregunta es inválida. No tiene el atributo id');
      }
      const newOptions = question.options;
      if (!newOptions || !newOptions.length || newOptions.length === 0) {
        reject('La pregunta es inválida. Las opciones no están definidas correctamente');
      }

      Question.findById(question.id).then((beforeQuestion) => {
        if (!question) {
          return reject('La pregunta no existe');
        }

        const newOptions = question.options;
        const beforeOptions = beforeQuestion.options;
        const optionsToCreate = [];
        const optionsToDelete = [];
        const optionsToUpdate = [];

        // Delete and update the ones that actually exists
        for (let i = 0; i < beforeOptions.length; i++) {
          let survives = false;
          for (let j = 0; j < newOptions.length; j++) {
            if (beforeOptions[i].id === newOptions[j].id) {
              survives = true;
              optionsToUpdate.push(this.save(newOptions[j]));
              break;
            }
          }

          if (!survives) {
            optionsToDelete.push(this.save(beforeOptions)[i]);
          }
        }
        const updatesPromise = Promise.all(optionsToUpdate);
        const deletePromise = Promise.all(optionsToDelete);
        const updateDeletePromise = Promise.all([updatesPromise, deletePromise]);
        for (let j = 0; j < newOptions.length; j++) {
          let create = true;
          for (let i = 0; i < newOptions.length; i++) {
            if (newOptions[i].id === newOptions[j].id) {
              create = false;
              break;
            }
          }
          if (create) {
            optionsToCreate.push(this.save(newOptions[j]));
          }
        }
        const newPromise = Promise.all(optionsToCreate);
        const allPromises = Promise.all([newPromise, updateDeletePromise]);

        allPromises.then(() => {
          // Return all the options of the question
          this.find({
            question_id: beforeQuestion.id,
          }).then((options) => {
            beforeQuestion.options = options;
            resolve(beforeQuestion);
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

  getName() {
    return new Promise((resolve) => {
      return resolve(`Se llamo a  ${Question.getName()}`);
      // console.log('estamos en options');
      // Question.getName().then((name) => {
      //   console.log(`llego ${name}`);
      //   return resolve(`Se llamo a  ${name}`);
      // });
    });
  }


}
const instance = new Options();
// module.exports = instance;
module.exports = Options;
