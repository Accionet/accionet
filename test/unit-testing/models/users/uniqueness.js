'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const User = require('../../../../server/models/users');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


// eslint-disable-next-line no-undef
describe('User check is Unique', () => {
  const password = 'pass';


  // eslint-disable-next-line no-undef
  it('Is taken', (done) => {
    const username = 'uniqueName';
    return User.new().then((user) => {
      user.username = username;
      user.password = password;
      user.email = 'a@a';
      User.usernameTaken(username).then((answer) => {
        assert.equal(true, answer);
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
  it('It is not taken', (done) => {
    User.usernameTaken('not taken username').then((answer) => {
      assert.equal(answer, false);
      done();
    })
      .catch((err) => {
        done(err);
      });
  });

  // eslint-disable-next-line no-undef
  it('Pass undefined as param', (done) => {
    User.usernameTaken(undefined).then((answer) => {
      assert.equal(answer, false);
      done();
    })
      .catch((err) => {
        done(err);
      });
  });
});
