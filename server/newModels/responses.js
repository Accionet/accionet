const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Response extends Table {

  constructor() {
    const table_name = 'response';
    super(table_name);
  }
}

const instance = new Response();

module.exports = instance;
