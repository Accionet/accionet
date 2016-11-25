const table = require('./table'); // eslint-disabled-this-line no-unused-vars
const EndUserDecorator = require('./decorators/CountEndUsers');


class Visits extends table {

  constructor() {
    const table_name = 'visits';
    super(table_name);
  }
}

const instance = new Visits();

EndUserDecorator.addCountEndUsers(instance);

module.exports = instance;
