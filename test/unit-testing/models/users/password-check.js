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
    return knex.seed.run()
      .then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
  });

  // eslint-disable-next-line no-undef
  it('Creates user and check password is encrypted', (done) => {
    return User.new().then((user) => {
      user.username = 'test name';
      user.password = password;
      user.email = 'a@a';
      User.save(user).then((savedUser) => {
        console.log(savedUser);
        assert.notEqual(savedUser.password, password);
        done();
      })
        .catch((err) => {
          done(err);
        });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Creates user and check password if password is valid', (done) => {
    return User.new().then((user) => {
      user.username = ' name';
      user.password = password;
      user.email = 'a@a';
      User.save(user).then((savedUser) => {
        assert.isTrue(User.validPassword(savedUser, password));
        assert.isFalse(User.validPassword(savedUser, 'invalid password'));

        done();
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
describe('User pass wrong parameters to valid password', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    return knex.seed.run()
      .then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
  });
  // eslint-disable-next-line no-undef
  it('Creates user and check password is encrypted', (done) => {
    assert.isFalse(User.validPassword(undefined, 'undefined'));
    return done();
  });
});
