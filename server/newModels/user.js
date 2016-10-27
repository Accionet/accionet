const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars


class Users extends Activatable {

  constructor() {
    const table_name = 'users';
    super(table_name);
  }
}

const instance = new Users();

module.exports = instance;
