'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Survey = require('../../../../server/models/surveys');
const Place = require('../../../../server/models/places');
const User = require('../../../../server/models/users');
const Access = require('../../../../server/models/access');
const knex = require('../../../../server/db/knex');


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
    name: 'name',
  };
}

function getSurvey() {
  return {
    title: 'title',
  };
}

// eslint-disable-next-line no-undef
describe('Save User with access to place.', () => {
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
  it('Save Access', (done) => {
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser();
      const accessType = 'r';
      newUser.access = {
        to: place.id,
        in: 'places',
        accessType,
      };
      User.save(newUser).then((savedUser) => {
        Access.find({
          user_id: savedUser.id,
          access_id: place.id,
          table_name: 'places',
        }).then((access) => {
        // only one element
          assert.equal(access.length, 1);
          assert.equal(access[0].access_type, accessType);
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
});

// eslint-disable-next-line no-undef
describe('Test Has Access.', () => {
// eslint-disable-next-line no-undef
  it('To place', (done) => {
    const table_name = 'places';
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser();
      newUser.access = {
        to: place.id,
        in: 'places',
        accessType: 'r',
      };
      User.save(getUser()).then((savedUser) => {
        Access.hasAccess(savedUser.id, place.id, table_name).then((access) => {
        // only one element
          assert.equal(access.length, 1);
          assert.equal(access[0].type, newUser.access.accessType);
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
  it('To survey', (done) => {
    const table_name = 'survey';
    return Survey.save(getSurvey()).then((place) => {
      const newUser = getUser();
      newUser.access = {
        to: place.id,
        in: table_name,
        accessType: 'r',
      };
      User.save(getUser()).then((savedUser) => {
        Access.hasAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(access.length, 1);
          assert.equal(access[0].type, newUser.access.accessType);
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
});
