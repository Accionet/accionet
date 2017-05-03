'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const Response = require('../../../../server/models/responses');
const Visit = require('../../../../server/models/visits');

const User = require('../../../../server/models/users');
const Survey = require('../../../../server/models/surveys');
const Access = require('../../../../server/models/access');
const Place = require('../../../../server/models/places');

// const utils = require('../../../../server/services/utils');
// const knex = require('../../../../server/db/knex');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);

let surveys = [];
let places = [];
let responsesCount = [];
let visitCount = [];
let user = {};
let admin = {};

function makeAccessToSurvey(to, user_id, access_type) {
  return { in: Survey.table_name,
    user_id,
    to,
    access_type,
  };
}

function makeAccessToPlace(to, user_id, access_type) {
  return { in: Place.table_name,
    user_id,
    to,
    access_type,
  };
}

function getUser() {
  return {
    username: 'username for access responses',
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

let n = 1;

function getAdmin() {
  n += 1;
  return {
    username: `username admin ${n} for access responses`,
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
    is_admin: true,
  };
}

function getActive(to) {
  const accessibles = [];
  if (to === 'surveys') {
    for (let i = 0; i < surveys.length; i++) {
      if (surveys[i].is_active) {
        accessibles.push(surveys[i]);
      }
    }
  } else {
    for (let i = 0; i < places.length; i++) {
      if (places[i].is_active) {
        accessibles.push(places[i]);
      }
    }
  }
  return accessibles;
}


function createAccessTo(user, to) {
  const activeAccessibles = getActive(to);
  if (to === 'surveys') {
    return Promise.all([Access.save(makeAccessToSurvey(activeAccessibles[0].id, user.id, 'r')), Access.save(makeAccessToSurvey(activeAccessibles[1].id, user.id, 'r/w'))]);
  }
  if (to === 'places') {
    return Promise.all([Access.save(makeAccessToPlace(activeAccessibles[0].id, user.id, 'r')), Access.save(makeAccessToPlace(activeAccessibles[1].id, user.id, 'r/w'))]);
  }
}

// eslint-disable-next-line no-undef
describe('Check for surveys:', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    return Survey.all().then((results) => {
      surveys = results;
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
  });

  // eslint-disable-next-line no-undef
  it('User that is not an admin', (done) => {
    const promises = [];
    const activeSurveys = getActive('surveys');
    for (let i = 0; i < activeSurveys.length; i++) {
      promises.push(Response.count({
        survey_id: activeSurveys[i].id,
      }));
    }
    return Promise.all(promises).then((counts) => {
      responsesCount = counts;
      Response.countAccessibleBy(user.id, true).then((accessibleCount) => {
        const shouldBe = parseInt(responsesCount[0], 10) + parseInt(responsesCount[1], 10);
        assert.equal(accessibleCount, shouldBe);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('User that is an admin', (done) => {
    return User.save(getAdmin()).then((tempAdmin) => {
      admin = tempAdmin;
      const promises = [];
      for (let i = 0; i < surveys.length; i++) {
        promises.push(Response.count({
          survey_id: surveys[i].id,
        }));
      }
      return Promise.all(promises).then((counts) => {
        responsesCount = counts;
        Response.countAccessibleBy(admin.id, true).then((accessibleCount) => {
          const shouldBe = parseInt(responsesCount[0], 10) + parseInt(responsesCount[1], 10) + parseInt(responsesCount[2], 10);
          assert.equal(accessibleCount, shouldBe);
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
describe('Check for visits:', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    return Place.all().then((results) => {
      places = results;
      createAccessTo(user, 'places').then(() => {
        done();
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
    const activePlaces = getActive('places');
    for (let i = 0; i < activePlaces.length; i++) {
      if (activePlaces[i].is_active) {
        promises.push(Visit.count({
          place_id: activePlaces[i].id,
        }));
      }
    }
    return Promise.all(promises).then((counts) => {
      visitCount = counts;
      Visit.countAccessibleBy(user.id, true).then((accessibleCount) => {
        const shouldBe = parseInt(visitCount[0], 10) + parseInt(visitCount[1], 10);
        assert.equal(accessibleCount, shouldBe);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('User that is an admin', (done) => {
    return User.save(getAdmin()).then((tempAdmin) => {
      admin = tempAdmin;
      const promises = [];
      for (let i = 0; i < places.length; i++) {
        promises.push(Visit.count({
          place_id: places[i].id,
        }));
      }
      return Promise.all(promises).then((counts) => {
        visitCount = counts;
        Visit.countAccessibleBy(admin.id, true).then((accessibleCount) => {
          const shouldBe = parseInt(visitCount[0], 10) + parseInt(visitCount[1], 10) + parseInt(visitCount[2], 10) + parseInt(visitCount[3], 10);
          assert.equal(accessibleCount, shouldBe);
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
