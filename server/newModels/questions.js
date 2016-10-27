const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Questions extends Table {

  constructor() {
    const table_name = 'questions';
    super(table_name);
  }
}

const instance = new Questions();

module.exports = instance;
