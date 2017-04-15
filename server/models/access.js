const Table = require('./table'); // eslint-disable-line no-unused-vars
const utils = require('../services/utils');
const Survey = require('./surveys');
const Place = require('./places');


const READ = 'r'; //eslint-disable-line
const READ_AND_WRITE = 'r/w';


class Access extends Table {

  constructor() {
    const table_name = 'access';
    super(table_name);
  }

  hasAccess(user_id, access_id, table_name) {
    return new Promise((resolve, reject) => {
      super.find({
        user_id,
        access_id,
        table_name,
      }).then((access) => {
        if (access.length === 0) {
          resolve(false);
        }
        resolve(access[0].access_type);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  hasReadAccess(user_id, access_id, table_name) {
    return new Promise((resolve, reject) => {
      this.hasAccess(user_id, access_id, table_name).then((access) => {
        if (access === READ_AND_WRITE || access === READ) {
          resolve(true);
        }
        resolve(false);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  hasWriteAccess(user_id, access_id, table_name) {
    return new Promise((resolve, reject) => {
      this.hasAccess(user_id, access_id, table_name).then((access) => {
        if (access === READ_AND_WRITE) {
          resolve(true);
        }
        resolve(false);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseAccessForClient(results) {
    results = utils.cloneJSON(results);
    for (let i = 0; i < results.length; i++) {
      this.renameAttributeInJson(results[i], 'access_id', 'to');
      this.renameAttributeInJson(results[i], 'table_name', 'in');
      this.renameAttributeInJson(results[i], 'access_type', 'accessType');
    }
    return results;
  }

  parseAccessForServer(results) {
    results = utils.cloneJSON(results);
    for (let i = 0; i < results.length; i++) {
      this.renameAttributeInJson(results[i], 'to', 'access_id');
      this.renameAttributeInJson(results[i], 'in', 'table_name');
      this.renameAttributeInJson(results[i], 'accessType', 'access_type');
    }
    return results;
  }

  renameAttributeInJson(json, oldName, newName) {
    if (!json || !json[oldName]) {
      return;
    }
    json[newName] = json[oldName];
    delete json[oldName];
  }

  find(attributes, columns, nameOrTitle) {
    return new Promise((resolve, reject) => {
      super.find(attributes, columns).then((results) => {
        if (nameOrTitle) {
          results = this.parseAccessForClient(results);
          resolve(this.addNamesAndTitles(results));
        } else {
          results = this.parseAccessForClient(results);
          resolve(results);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getTitle(survey) {
    return new Promise((resolve, reject) => {
      Survey.find({
        id: survey.to,
      }, ['title']).then((results) => {
        if (results.length === 1) {
          survey.title = results[0].title;
        }
        resolve(survey);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  getName(place) {
    return new Promise((resolve, reject) => {
      Place.find({
        id: place.to,
      }, ['name']).then((results) => {
        if (results.length === 1) {
          place.name = results[0].name;
        }
        resolve(place);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  addNamesAndTitles(results) {
    const promises = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].in === Survey.table_name) {
        promises.push(this.getTitle(results[i]));
      }
      if (results[i].in === Place.table_name) {
        promises.push(this.getName(results[i]));
      }
    }
    return Promise.all(promises);
  }


  save(attr) {
    attr = this.parseAccessForServer([attr]);
    return super.save(attr[0]);
  }

  update(id, attributes) {
    const parsedAttributes = {
      table_name: attributes.in,
      access_id: attributes.to,
      access_type: attributes.accessType,
    };
    return new Promise((resolve, reject) => {
      // console.log('here');
      super.update(id, parsedAttributes).then((results) => {
        results = this.parseAccessForClient([results]);
        resolve(results[0]);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new Access();

module.exports = instance;
