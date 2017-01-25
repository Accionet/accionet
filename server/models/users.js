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
    console.log(password);
    console.log(user);
    return bcrypt.compareSync(password, user.password);
  }

}

const user = new User();
module.exports = user;
