const Activatable = require('./activatable'); // eslint-disable-line no-unused-vars
const Access = require('./access');
const bcrypt = require('bcrypt-nodejs');


class User extends Activatable {


  constructor() {
    const table_name = 'users';
    super(table_name);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(user, password) {
    // invalid arguments
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compareSync(password, user.password);
  }

  usernameTaken(username) {
    return new Promise((resolve, reject) => {
      super.find({ username }).then((results) => {
        if (results.length > 0) {
          return resolve(true);
        }
        resolve(false);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  parseAccess(entryArray, user_id) {
    // entryArray is not an array
    if (!Array.isArray(entryArray)) {
      return false;
    }
    const returnArray = [];
    for (let i = 0; i < entryArray.length; i++) {
      const entry = entryArray[i];
      if (entry && entry.to && entry.in && entry.accessType && user_id) {
        returnArray.push({
          access_id: entry.to,
          user_id,
          table_name: entry.in,
          access_type: entry.accessType,
        });
      } else {
        return false;
      }
    }
    return returnArray;
  }

  saveAccess(accessArray) {
    const promises = [];
    for (let i = 0; i < accessArray.length; i++) {
      promises.push(Access.save(accessArray[i]));
    }
    return Promise.all(promises);
  }

  save(originalEntry) {
    // if it is not defined (or false) set it to false
    if (!originalEntry.is_active) {
      originalEntry.is_active = false;
    }
    // set email verified to false by default
    originalEntry.email_verified = false;

    // encrypt password
    originalEntry.password = this.generateHash(originalEntry.password);

    const access_params = originalEntry.access;
    delete originalEntry.access;

    return new Promise((resolve, reject) => {
      super.save(originalEntry).then((savedUser) => {
        const access = this.parseAccess(access_params, savedUser.id);
        if (access) {
          this.saveAccess(access).then(() => {
            resolve(savedUser);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(savedUser);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }


}

const user = new User();
module.exports = user;
