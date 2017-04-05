const Activatable = require('./activatable'); // eslint-disable-line no-unused-vars

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

  save(originalEntry) {
    // if it is not defined (or false) set it to false
    if (!originalEntry.is_active) {
      originalEntry.is_active = false;
    }
    // set email verified to false by default
    originalEntry.email_verified = false;

    // encrypt password
    originalEntry.password = this.generateHash(originalEntry.password);

    return super.save(originalEntry);
  }

}

const user = new User();
module.exports = user;
