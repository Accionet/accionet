const Table = require('./table'); // eslint-disable-line no-unused-vars

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

}

const instance = new Access();

module.exports = instance;
