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


function getUser(i) {
  return {
    username: `username${i}`,
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


function isAccessToPlaceSavedIn(placeAccess, access) {
  return access.to === placeAccess.to && access.in === placeAccess.in;
}

// eslint-disable-next-line no-undef
describe('Test Has Access. Several', () => {
  // eslint-disable-next-line
  before((done) => {
    return knex.seed.run()
      .then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
  });
  // eslint-disable-next-line no-undef
  it('Read: only read', (done) => {
    return Place.save(getPlace()).then((place1) => {
      Place.save(getPlace()).then((place2) => {
        const newUser = getUser(2);
        const accessToSave = [{
          to: place1.id,
          in: 'places',
          accessType: 'r',
        }, {
          to: place2.id,
          in: 'places',
          accessType: 'r/w',
        }];
        newUser.access = accessToSave;
        User.save(newUser).then((savedUser) => {
          Access.find({
            user_id: savedUser.id,
          }).then((access) => {
            // only two element
            assert.equal(access.length, 2);
            const accessToPlace1Saved = isAccessToPlaceSavedIn(accessToSave[0], access[0]) || isAccessToPlaceSavedIn(accessToSave[0], access[1]);
            const accessToPlace2Saved = isAccessToPlaceSavedIn(accessToSave[1], access[0]) || isAccessToPlaceSavedIn(accessToSave[1], access[1]);
            assert.equal(accessToPlace1Saved, true);
            assert.equal(accessToPlace2Saved, true);
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
    }).catch((err) => {
      done(err);
    });
  });
});
