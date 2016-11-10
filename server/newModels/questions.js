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
