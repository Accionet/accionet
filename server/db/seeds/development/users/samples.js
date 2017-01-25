const User = require('../../../../models/users');

module.exports = [{
  username: 'accionet',
  password: User.generateHash('accionet159'),
  email: 'antonio@accionet.cl',
  is_admin: true,
  is_active: true,
}];
