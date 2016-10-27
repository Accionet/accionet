// server/models/table.js
'use strict';

const knex = require('../db/knex');


class Table {

  constructor(table_name) {
    this.table_name = table_name;
  }

  toString() {
    return this.table_name;
  }

  table() {
    return knex(this.table_name);
  }


  // ################################################
  // CUD FROM CRUD
  // ################################################

  new() {
    const table_name = this.table_name;
    return new Promise((resolve, reject) => {
      knex('information_schema.columns').select('column_name').where({
        table_name,
      }).then((attributes) => {
          // check if attributes is an array
        if (!attributes || attributes.length === 0) {
          reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
        }
        const entry = {};
        attributes.forEach((attribute) => {
          entry[attribute.column_name] = null;
        });
        resolve(entry);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  save(entry) {
    this.addTimestamps(entry, true);
    return new Promise((resolve, reject) => {
      this.table().insert(entry).returning('*').then((entry) => {
          // check if attributes is an array
        if (!entry || entry.length === 0) {
          reject('Hubo un error creando un la entrada');
        }
        resolve(entry[0]);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  update(id, attr) {
    this.addTimestamps(attr, false);
    return new Promise((resolve, reject) => {
      this.table().where({
        id,
      }).update(attr).returning('*')
        .then((entry) => {
          // check if attributes is an array
          if (!entry || entry.length === 0) {
            reject('Hubo un error modificando la entrada');
          }
          resolve(entry[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      this.table().where({
        id,
      }).del().returning('*')
        .then((entry) => {
          // check if attributes is an array
          if (!entry || entry.length === 0) {
            reject('Hubo un error eliminando la entrada');
          }
          resolve(entry[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // eslint-disable-next-line
  addTimestamps(attr, isNew) {
    if (isNew) {
      attr.created_at = new Date();
    }
    attr.updated_at = new Date();
  }

  // ################################################
  // Find (R from CRUD)
  // ################################################
  all() {
    return this.find({});
  }

  find(attributes) {
    return this.table().select().where(attributes);
  }

  findById(id) {
    const attributes = {
      id,
    };
    return new Promise((resolve, reject) => {
      this.find(attributes).then((surveys) => {
        if (surveys.length !== 0) {
          resolve(surveys[0]);
        }
        reject(`No se encontró una entrada con id = ${id}`);
      })
          .catch((error) => {
            reject(error);
          });
    });
  }
    // ################################################
    // Miscelaneous
    // ################################################

  getFirstDate() {
    return new Promise((resolve, reject) => {
      this.table().select('created_at').orderBy('created_at', 'asc').first()
        .then((results) => {
          if (results && results.created_at) {
            resolve(results.created_at);
          }
          reject('No se encontró una respuesta válida');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAttributesNames() {
    const table_name = this.table_name;
    return new Promise((resolve, reject) => {
      knex('information_schema.columns').select('column_name').where({
        table_name,
      }).then((results) => {
          // check if results is an array
        if (!results || results.length === 0) {
          reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
        }
        const attributes = [];
        results.forEach((attribute) => {
          attributes.push(attribute.column_name);
        });
        resolve(attributes);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  count() {
    return new Promise((resolve, reject) => {
      this.table().count('*')
        .then((results) => {
          if (results[0].count) {
            resolve(results[0].count);
          }
          reject('No se encontró una respuesta válida');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


}

module.exports = Table;
