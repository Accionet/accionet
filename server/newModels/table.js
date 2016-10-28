// server/models/table.js
'use strict';

const knex = require('../db/knex');
const utils = require('../services/utils');


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
          return reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
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
    const errorString = 'Something went wrong';
    return new Promise((resolve, reject) => {
      this.parseAttributesForUpsert(entry, true)
        .then((attributes) => {
          this.table().insert(attributes).returning('*').then((entry) => {
              // check if attributes is an array
            if (!entry || entry.length === 0) {
              return reject(errorString);
            }
            resolve(entry[0]);
          })
            .catch(() => {
              reject(errorString);
            });
        }).catch((err) => {
          reject(err);
        });
    });
  }

  update(id, attr) {
    const errorString = 'Something went wrong';
    return new Promise((resolve, reject) => {
      this.findById(id).then((oldEntry) => {
        if (attr && attr.id && id !== attr.id) {
          return reject('Given IDs differ');
        }
        this.parseAttributesForUpsert(attr, false).then((attributes) => {
          this.table().where({
            id,
          }).update(attributes).returning('*')
            .then((entry) => {
              // check if attributes is an array
              if (!entry || entry.length === 0) {
                return reject(errorString);
              }
              resolve(entry[0]);
            })
            .catch(() => {
              reject(errorString);
            });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
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
            return reject('Hubo un error eliminando la entrada');
          }
          resolve(entry[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


  // ################################################
  // Find (R from CRUD)
  // ################################################
  all() {
    return this.find({});
  }

  find(attributes) {
    return new Promise((resolve, reject) => {
      this.filterAttributes(attributes)
        .then((filteredAttributes) => {
          this.table().select().where(filteredAttributes).then((results) => {
            return resolve(results);
          })
            .catch(() => {
              reject('Find parameter was not defined correctly');
            });
        })
        .catch((err) => {
          reject(err);
        });
    });

    //
  }

  findById(id) {
    const attributes = {
      id,
    };
    return new Promise((resolve, reject) => {
      this.find(attributes).then((surveys) => {
        if (surveys.length !== 0) {
          return resolve(surveys[0]);
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
            return resolve(results.created_at);
          }
          return reject('No se encontró una respuesta válida');
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
          return reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
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
            return resolve(results[0].count);
          }
          reject('No se encontró una respuesta válida');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // ################################################
  // 'Private' methods (static)
  // ################################################

  // eslint-disable-next-line
  static addTimestamps(attr, isNew) {
    if (isNew) {
      attr.created_at = new Date();
    }
    attr.updated_at = new Date();
  }

  // Makes sure not to go searching for wierd stuff
  filterAttributes(attributes) {
    return new Promise((resolve, reject) => {
      if (!utils.isJSON(attributes)) {
        return reject('Parameter should be a valid json');
      }

      this.getAttributesNames().then((attributeNames) => {
        const filteredAttributes = {};
        let counter = 0;
        for (let i = 0; i < attributeNames.length; i++) {
          const attributeName = attributeNames[i];
          if (attributeName in attributes) {
            counter++;
            filteredAttributes[attributeName] = attributes[attributeName];
          }
        }
        if (counter !== Object.keys(attributes).length) {
          return reject('Parameter contains invalid attributes');
        }
        return resolve(filteredAttributes);
      })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static removeUnSetableAttributes(attributes) {
    delete attributes.id;
    delete attributes.created_at;
    delete attributes.updated_at;
  }

  parseAttributesForUpsert(attributes, isNew) {
    return new Promise((resolve, reject) => {
      Table.removeUnSetableAttributes(attributes);
      this.filterAttributes(attributes).then((filteredAttributes) => {
        Table.removeUnSetableAttributes(filteredAttributes);

        if (utils.isEmptyJSON(filteredAttributes)) {
          return reject('Paremeter should not be empty');
        }

        Table.addTimestamps(filteredAttributes, isNew);
        resolve(filteredAttributes);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

module.exports = Table;
