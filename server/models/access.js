const Table = require('./table'); // eslint-disable-line no-unused-vars

class Access extends Table {

  constructor() {
    const table_name = 'access';
    super(table_name);
  }

}

const instance = new Access();

module.exports = instance;
