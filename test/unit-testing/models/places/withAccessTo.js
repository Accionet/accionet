'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Place = require('../../../../server/models/places');
const User = require('../../../../server/models/users');
const Access = require('../../../../server/models/access');
const knex = require('../../../../server/db/knex');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


function getUser() {
  const i = 3;
  return {
    username: `username for access place ${i}`,
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

function getPlace() {
  return {
    name: 'name',
  };
}

function makeAccess(to, user_id, access_type) {
  return {
    to,
    user_id,
    in: Place.table_name,
    access_type,
  };
}

function placeIsInArray(place, accessType, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === place.id && array[i].accessType === accessType) {
      return true;
    }
  }
  return false;
}


let user;
let places;

// eslint-disable-next-line no-undef
describe('Get places to whom he has access.', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    return knex('users').del().then(() => {
      Promise.all([Place.save(getPlace()), Place.save(getPlace()), Place.save(getPlace()), User.save(getUser())]).then((results) => {
        user = results[3];
        places = results.slice(0, 3);
        const promises = [];
        promises.push(Access.save(makeAccess(places[0].id, user.id, 'r')));
        promises.push(Access.save(makeAccess(places[1].id, user.id, 'r/w')));
        Promise.all(promises).then(() => {
          done();
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
  it('check correct places are returned', (done) => {
    return Place.accessibleBy(user.id).then((accessiblePlaces) => {
      assert.equal(placeIsInArray(places[0], 'r', accessiblePlaces), true);
      assert.equal(placeIsInArray(places[1], 'r/w', accessiblePlaces), true);
      assert.equal(placeIsInArray(places[2], null, accessiblePlaces), false);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
