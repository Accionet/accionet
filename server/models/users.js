const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const bcrypt = require('bcrypt-nodejs');


class User extends Table {


  constructor() {
    const table_name = 'users';
    super(table_name);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  save(originalEntry) {
    // if it is not defined (or false) set it to false
    if (!originalEntry.is_active) {
      originalEntry.is_active = false;
    }
    return super.save(originalEntry);
  }

}

const user = new User();
module.exports = user;
