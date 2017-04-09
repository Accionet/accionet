'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Survey = require('../../../../server/models/surveys');
const Place = require('../../../../server/models/places');
const User = require('../../../../server/models/users');
const Access = require('../../../../server/models/access');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


function getUser() {
  return {
    username: 'username',
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

function getPlace() {
  return {

  };
}

// eslint-disable-next-line no-undef
describe('Save User with access to place.', () => {
// eslint-disable-next-line no-undef
  it('Save Access', (done) => {
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser();
      newUser.access = {
        to: place.id,
        in: 'places',
        accessType: 'r',
      };
      User.save(getUser()).then((savedUser) => {
        Access.find({
          user_id: savedUser.id,
          place_id: place.id,
        }).then((access) => {
        // only one element
          assert.equal(access.length, 1);
          assert.equal(access[0].type, newUser.access.accessType);
        }).catch((err) => {
          done(err);
        });
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
// eslint-disable-next-line no-undef
  it('Save Access: bad params', (done) => {
    const newUser = getUser();
    const place_id = -4;
    newUser.access = {
      to: place_id,
      in: 'places',
      accessType: 'r',
    };

    return User.save(getUser()).then((savedUser) => {
      Access.find({
        user_id: savedUser.id,
        place_id,
      }).then((access) => {
        done(access);
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
