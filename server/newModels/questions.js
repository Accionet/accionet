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
            this.findById(question.id).then((question) => {
              resolve(question);
            }).catch((err) => {
              reject(err);
            });
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
    // // Creates a json with the attr in attr
    // function saveQuestionAndOptions(attr, callback) {
    //   const deferrer = q.defer();
    //   base.save(attr, table_name, (err, question) => {
    //     const options = attr.options;
    //
    //     let saved = 0;
    //
    //     if (options && options.length && options.length > 0) {
    //       for (let i = 0; i < options.length; i++) {
    //         options[i].question_id = question.id;
    //         Options.save(options[i], (err_opt) => {
    //           if (err_opt) {
    //             deferrer.reject(err_opt);
    //           }
    //           saved += 1;
    //           if (saved === options.length) {
    //             deferrer.resolve(question);
    //           }
    //         });
    //       }
    //     } else {
    //       deferrer.resolve(question);
    //     }
    //     deferrer.promise.nodeify(callback);
    //     return deferrer.promise;
    //   });
    // }

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
