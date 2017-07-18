const table = require('./table'); // eslint-disable-line no-unused-vars
const Activatable = require('./activatable');
const AccessibleDecorator = require('./decorators/Accessible');


class Hotspot extends Activatable {

  constructor() {
    const table_name = 'hotspots';
    super(table_name);
  }
}

const instance = new Hotspot();


AccessibleDecorator.decorate(instance);
module.exports = instance;
