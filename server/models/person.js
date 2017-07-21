const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const knex = require('../db/knex');


class Person extends Table {

  constructor() {
    const table_name = 'person';
    super(table_name);
  }


  findByFBId(id) {
    const that = this;

    return new Promise((resolve, reject) => {
      that.table().select('*').where(knex.raw("facebook->>'id' = ?", [id])).then((v) => {
        if (v.length > 0) {
          resolve(v[0]);
        }
        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

}

const instance = new Person();

module.exports = instance;
