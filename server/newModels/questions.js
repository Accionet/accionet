'use strict';
const Table = require('./table'); // eslint-disabled-this-line no-unused-vars

// const Option = new Options();

// const Place = require('./places');


class Questions extends Table {

  constructor() {
    const table_name = 'questions';
    super(table_name);
  }

  parseToSend(question) {
    const Option = require('./options'); // eslint-disabled-this-line

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
