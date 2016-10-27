const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Options extends Table {

  constructor() {
    const table_name = 'options';
    super(table_name);
  }
}

const instance = new Options();

module.exports = instance;
