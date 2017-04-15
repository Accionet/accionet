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

let n = 0;

function getUser() {
  n += 1; //eslint-disable-line
  return {
    username: `username${n}`,
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

function getPlace() {
  n += 1; //eslint-disable-line
  return {
    name: `place${n}`,
  };
}

function getSurvey() {
  n += 1; //eslint-disable-line
  return {
    title: `title${n}`,
  };
}

// eslint-disable-next-line no-undef
describe('Find Access, check it brings name.', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    const promises = [];
    promises.push(knex(User.table_name).del());
    promises.push(knex(Place.table_name).del());
    promises.push(knex(Survey.table_name).del());

    return Promise.all(promises)
      .then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
  });
  // eslint-disable-next-line no-undef
  it('Find Access for place', (done) => {
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser();
      const accessType = 'r';
      newUser.access = [{
        to: place.id,
        in: 'places',
        accessType,
      }];
      User.save(newUser).then((savedUser) => {
        Access.find({
          user_id: savedUser.id,
          access_id: place.id,
          table_name: 'places',
        }, 'all', true).then((access) => {
          // only one element
          assert.equal(access[0].name, place.name);
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
  it('Find Access for survey', (done) => {
    return Survey.save(getSurvey()).then((survey) => {
      const newUser = getUser();
      const accessType = 'r';
      newUser.access = [{
        to: survey.id,
        in: 'surveys',
        accessType,
      }];
      User.save(newUser).then((savedUser) => {
        Access.find({
          user_id: savedUser.id,
          access_id: survey.id,
          table_name: 'surveys',
        }, 'all', true).then((access) => {
          // only one element
          assert.equal(access[0].title, survey.title);
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
  it('Find Access for survey and place', (done) => {
    return Place.save(getPlace()).then((place) => {
      Survey.save(getSurvey()).then((survey) => {
        const newUser = getUser();
        const accessType = 'r';
        newUser.access = [{
          to: place.id,
          in: 'places',
          accessType,
        }, {
          to: survey.id,
          in: 'surveys',
          accessType,
        }];
        User.save(newUser).then((savedUser) => {
          Access.find({
            user_id: savedUser.id,
          }, 'all', true).then((access) => {
            // only one element
            assert.equal(access[1].title, survey.title);
            assert.equal(access[0].name, place.name);
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
});
