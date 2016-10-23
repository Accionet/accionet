'use strict';

// Food is a base class
class Table {

  constructor(table_name) {
    this.table_name = table_name;
  }

  toString() {
    return this.table_name;
  }
}

module.exports = Table;
