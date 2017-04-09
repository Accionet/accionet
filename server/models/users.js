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

  parseAccess(entry, user_id) {
    if (entry && entry.to && entry.in && entry.accessType && user_id) {
      return {
        access_id: entry.to,
        user_id,
        table_name: entry.in,
        access_type: entry.accessType,
      };
    }
    return false;
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
    console.log(originalEntry);

    return new Promise((resolve, reject) => {
      super.save(originalEntry).then((savedUser) => {
        const access = this.parseAccess(access_params, savedUser.id);
        if (access) {
          console.log(access);
          Access.save(access).then(() => {
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
