const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Visits extends Table {

  constructor() {
    const table_name = 'visits';
    super(table_name);
  }
}

const instance = new Visits();

module.exports = instance;
