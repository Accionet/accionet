'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const knex = require('../../../../server/db/knex');
const User = require('../../../../server/models/users');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


// eslint-disable-next-line no-undef
describe('User check valid password', () => {
  const password = 'pass';

  // eslint-disable-next-line no-undef
  before((done) => {
    return knex(User.table_name).del()
      .then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
  });

  // eslint-disable-next-line no-undef
  it('Creates admin user', (done) => {
    return User.new().then((user) => {
      user.username = 'test name';
      user.password = password;
      user.is_admin = true;
      user.email = 'a@a';
      User.save(user).then((savedUser) => {
        User.isAdmin(savedUser.id).then((isAdmin) => {
          assert.equal(isAdmin, true);
          done();
        }).catch((err) => {
          done(err);
        });
      })
        .catch((err) => {
          done(err);
        });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Creates not admin user', (done) => {
    return User.new().then((user) => {
      user.username = 'test name 1';
      user.password = password;
      user.is_admin = false;
      user.email = 'a@a';
      User.save(user).then((savedUser) => {
        User.isAdmin(savedUser.id).then((isAdmin) => {
          assert.equal(isAdmin, false);
          done();
        }).catch((err) => {
          done(err);
        });
      })
        .catch((err) => {
          done(err);
        });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Creates not admin user (by not specify isAdmin)', (done) => {
    return User.new().then((user) => {
      user.username = 'test name 2';
      user.password = password;
      user.email = 'a@a';
      User.save(user).then((savedUser) => {
        User.isAdmin(savedUser.id).then((isAdmin) => {
          assert.equal(isAdmin, false);
          done();
        }).catch((err) => {
          done(err);
        });
      })
        .catch((err) => {
          done(err);
        });
    }).catch((err) => {
      done(err);
    });
  });
});

// eslint-disable-next-line no-undef
describe('Pass wrong params', () => {
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-undef
  it('undefined', (done) => {
    return User.isAdmin(undefined).then(() => {
      done('it should not return as valid');
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Id of no user', (done) => {
    User.isAdmin(-1).then(() => {
      done('it should not return as valid');
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Id not a valid param', (done) => {
    User.isAdmin('this is not valid').then(() => {
      done('it should not return as valid');
    }).catch((err) => {
      done(err);
    });
  });
});
