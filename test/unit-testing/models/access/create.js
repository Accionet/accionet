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
      const newUser = getUser(1);
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
        }).then((access) => {
          // only one element
          assert.equal(access.length, 1);
          assert.equal(access[0].accessType, accessType);
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
    const table_name = 'places';
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser(2);
      newUser.access = [{
        to: place.id,
        in: 'places',
        accessType: 'r',
      }];
      User.save(newUser).then((savedUser) => {
        Access.hasReadAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(access, true);
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
  it('Read: read and write', (done) => {
    const table_name = 'places';
    return Place.save(getPlace()).then((place) => {
      const newUser = getUser(3);
      newUser.access = [{
        to: place.id,
        in: 'places',
        accessType: 'r/w',
      }];
      User.save(newUser).then((savedUser) => {
        Access.hasReadAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(access, true);
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
  it('Read: it doesnt have', (done) => {
    const table_name = 'places';
    return Place.save(getPlace()).then((place) => {
      User.save(getUser(4)).then((savedUser) => {
        Access.hasReadAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(access, false);
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
  it('Write: with only r', (done) => {
    const table_name = 'survey';
    return Survey.save(getSurvey()).then((place) => {
      const newUser = getUser(5);
      newUser.access = [{
        to: place.id,
        in: table_name,
        accessType: 'r',
      }];
      User.save(getUser(6)).then((savedUser) => {
        Access.hasWriteAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(false, access);
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
  it('Write: with r/w', (done) => {
    const table_name = 'survey';
    return Survey.save(getSurvey()).then((place) => {
      const newUser = getUser(7);
      newUser.access = [{
        to: place.id,
        in: table_name,
        accessType: 'r/w',
      }];
      User.save(newUser).then((savedUser) => {
        Access.hasWriteAccess(savedUser.id, place.id, table_name).then((access) => {
          // only one element
          assert.equal(true, access);
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
