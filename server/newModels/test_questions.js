'use strict';
const Table = require('./test_table'); // eslint-disabled-this-line no-unused-vars

// const Option = new Options();

// const Place = require('./places');


class Questions extends Table {

  constructor() {
    const table_name = 'questions';
    super(table_name);
  }

  parseToSend(question) {
    const Option = require('./test_options'); // eslint-disable-line
    return new Promise((resolve, reject) => {
      question.options = [{}, {}];
      console.log('-------------');
      console.log(Option);
      resolve(question);
      // Option.find({
      //   question_id: question.id,
      // }).then((options) => {
      //   question.options = options;
      //   resolve(question);
      // }).catch((err) => {
      //   reject(err);
      // });
    });
  }

  getName() {
    return this.table_name;
    // return new Promise(function (resolve, reject) {
    //   console.log('llego para quesitons');
    //   return resolve(this.table_name);
    // });
  }

}

const instance = new Questions();

module.exports = instance;
