const table = require('./table'); // eslint-disabled-this-line no-unused-vars


class Hotspot extends table {

  constructor() {
    const table_name = 'hotspots';
    super(table_name);
  }
}

const instance = new Hotspot();

module.exports = instance;
