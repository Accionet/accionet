const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars


class Places extends Activatable {

  constructor() {
    const table_name = 'places';
    super(table_name);
  }
}

const instance = new Places();

module.exports = instance;
