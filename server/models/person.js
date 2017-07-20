const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Person extends Table {

  constructor() {
    const table_name = 'person';
    super(table_name);
  }


  findByFBId() {

  }

}

const instance = new Person();

module.exports = instance;
