const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars


class Surveys extends Activatable {

  constructor() {
    const table_name = 'surveys';
    super(table_name);
  }
}

const instance = new Surveys();

module.exports = instance;
