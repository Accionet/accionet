'use strict';

const Table = require('./table');


class Options extends Table {

  constructor() {
    const table_name = 'options';
    super(table_name);
  }

  updateOptionsOfQuestion(question) {
    const Question = require('./questions'); // eslint-disable-line global-require

    return new Promise((resolve, reject) => {
      // Check for valid parameters
      if (!question || !question.id) {
        reject('La pregunta es inválida. No tiene el atributo id');
      }
      const newOptions = question.options;
      if (!newOptions || !newOptions.length || newOptions.length === 0) {
        reject('La pregunta es inválida. Las opciones no están definidas correctamente');
      }
      //
      Question.findById(question.id).then((beforeQuestion) => {
        if (!question) {
          return reject('La pregunta no existe');
        }

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
              optionsToUpdate.push(this.update(newOptions[j].id, newOptions[j]));
              break;
            }
          }

          if (!survives) {
            optionsToDelete.push(this.delete(beforeOptions[i].id));
          }
        }
        const updatesPromise = Promise.all(optionsToUpdate);
        const deletePromise = Promise.all(optionsToDelete);
        const updateDeletePromise = Promise.all([updatesPromise, deletePromise]);
        for (let j = 0; j < newOptions.length; j++) {
          let create = true;
          for (let i = 0; i < beforeOptions.length; i++) {
            if (newOptions[j].id === beforeOptions[i].id) {
              create = false;
              break;
            }
          }
          if (create) {
            newOptions[j].question_id = beforeQuestion.id;

            optionsToCreate.push(this.save(newOptions[j]));
          }
        }
        const newPromise = Promise.all(optionsToCreate);
        const allPromises = Promise.all([newPromise, updateDeletePromise]);

        allPromises.then(() => {
          // Return all the options of the question
          Question.findById(beforeQuestion.id).then((modifiedQuestion) => {
            resolve(modifiedQuestion);
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


}
const instance = new Options();
module.exports = instance;
// module.exports = Options;
