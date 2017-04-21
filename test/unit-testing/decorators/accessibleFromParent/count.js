'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const Response = require('../../../../server/models/responses');
const User = require('../../../../server/models/users');
const Survey = require('../../../../server/models/surveys');
const Access = require('../../../../server/models/access');
// const utils = require('../../../../server/services/utils');
const knex = require('../../../../server/db/knex');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);

let surveys = [];
let responsesCount = [];
let user = {};

function makeAccessToSurvey(to, user_id, access_type) {
  return { in: Survey.table_name,
    user_id,
    to,
    access_type,
  };
}

function getUser() {
  return {
    username: 'username for access visits',
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

function createAccessTo(user, to) {
  if (to === 'surveys') {
    return Promise.all([Access.save(makeAccessToSurvey(surveys[0], user.id, 'r')), Access.save(makeAccessToSurvey(surveys[1], user.id, 'r/w'))]);
  }
}

// eslint-disable-next-line no-undef
describe('Check for surveys:', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    return knex.seed.run().then(() => {
      Survey.all().then((results) => {
        surveys = results;
        console.log(surveys);
        User.save(getUser()).then((tempUser) => {
          user = tempUser;
          createAccessTo(user, 'surveys').then(() => {
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

  // eslint-disable-next-line no-undef
  it('User that is not an admin', (done) => {
    const promises = [];
    for (let i = 0; i < surveys.length; i++) {
      promises.push(Response.count({
        survey_id: surveys[i].id,
      }));
    }
    return Promise.all(promises).then((counts) => {
      responsesCount = counts;
      console.log(counts);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
