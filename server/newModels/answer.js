const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Answer extends Table {

  constructor() {
    const table_name = 'answer';
    super(table_name);
  }
}

const instance = new Answer();

module.exports = instance;
