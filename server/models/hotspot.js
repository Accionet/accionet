const table = require('./table'); // eslint-disabled-this-line no-unused-vars
const AccessibleDecorator = require('./decorators/Accessible');


class Hotspot extends table {

  constructor() {
    const table_name = 'hotspots';
    super(table_name);
  }
}

const instance = new Hotspot();


AccessibleDecorator.decorate(instance);
module.exports = instance;
