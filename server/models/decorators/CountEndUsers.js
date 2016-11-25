const knex = require('../../db/knex');


function countEndUsers(searchParams) {
  return new Promise((resolve, reject) => {
    const table_name = this.toString();
    knex.count('*').from(function () {
      this.distinct('macaddress').select().from(table_name).where(searchParams)
          .as('t1');
    }).as('ignored_alias').then((response) => {
      const amount = parseInt(response[0].count, 10);
      resolve(amount);
    })
      .catch((err) => {
        reject(err);
      });
  });
}

exports.addCountEndUsers = function (prototype) {
  prototype.countEndUsers = countEndUsers;
};
