const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const knex = require('../db/knex');


class MacAddressInterface extends Table {

  constructor() {
    const table_name = 'visits';
    super(table_name);
  }

  countEndUsers(searchParams) {
    return new Promise((resolve, reject) => {
      const table_name = this.toString();
      knex.count('*').from(function () {
        this.distinct('macaddress').select().from(table_name).where(searchParams)
            .as('t1');
      }).as('ignored_alias').then((response) => {
        console.log(searchParams);
        console.log(response);
        const amount = parseInt(response[0].count, 10);
        resolve(amount);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }
}


module.exports = MacAddressInterface;
