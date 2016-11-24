const MacAddressInterface = require('./MacAddressInterface');


class Response extends MacAddressInterface {

  constructor() {
    const table_name = 'response';
    super(table_name);
  }
}

const instance = new Response();

module.exports = instance;
