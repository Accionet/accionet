'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Place = require('../../../../server/models/places');
const User = require('../../../../server/models/users');
const knex = require('../../../../server/db/knex');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

let n = 0;

function getUser() {
  n += 1;
  return {
    username: `usernameForAccess${n}`,
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

let places = [];


function setAccessTo(place, accessType) {
  return { in: 'places',
    to: place.id,
    accessType,
  };
}

function accessIsIn(access, array) {
  for (let i = 0; i < array.length; i++) {
    if (access.in === array[i].in && access.to === array[i].to && access.accessType === array[i].accessType) {
      return true;
    }
  }
  return false;
}

// eslint-disable-next-line no-undef
describe('Edit access of user.', () => {
  // eslint-disable-next-line no-undef
  before((done) => {
    const promises = [];
    const knexPromises = [];
    knexPromises.push(knex('users').del());
    knexPromises.push(knex('access').del());

    for (let i = 0; i < 4; i++) {
      promises.push(Place.save(getPlace()));
    }
    return Promise.all(knexPromises).then(() => {
      Promise.all(promises).then((results) => {
        places = results;
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Only add new', (done) => {
    const newUser = getUser(1);
    const initialAccess = [];

    initialAccess.push(setAccessTo(places[0], 'r'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      initialAccess.push(setAccessTo(places[1], 'r'));
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        assert.equal(accessIsIn(initialAccess[1], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Only edit existing', (done) => {
    const newUser = getUser(2);
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    // console.log(initialAccess);
    return User.save(newUser).then((user) => {
      initialAccess[0].accessType = 'r/w';
      initialAccess[1].accessType = 'r';
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        assert.equal(accessIsIn(initialAccess[1], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Only delete existing', (done) => {
    const newUser = getUser(1);
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      initialAccess.splice(1, 1);
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Delete one, edit one and add one new', (done) => {
    const newUser = getUser(1);
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      // edit
      initialAccess[0].accessType = 'r/w';
      // delete
      initialAccess.splice(1, 1);
      // add
      initialAccess.push(setAccessTo(places[3], 'r/w'));
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        assert.equal(accessIsIn(initialAccess[1], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});

// eslint-disable-next-line no-undef
describe('Edge cases.', () => {
  // eslint-disable-next-line no-undef
  it('Delete all', (done) => {
    const newUser = getUser(1);
    let initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      initialAccess = [];
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(finalAccess.length, 0);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass undifined access', (done) => {
    const newUser = getUser(1);
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      User.editAccess(user, undefined).then(() => {
        done('error');
      }).catch((err) => {
        assert.equal(err, 'Access param not defined correctly');
        done();
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass undifined user', (done) => {
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    return User.editAccess(undefined, initialAccess).then(() => {
      done('error');
    }).catch((err) => {
      assert.equal(err, 'User param not defined correctly');
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Initially no access defined', (done) => {
    const newUser = getUser(1);

    return User.save(newUser).then((user) => {
      const initialAccess = [];
      initialAccess.push(setAccessTo(places[1], 'r'));
      initialAccess.push(setAccessTo(places[2], 'r/w'));
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        assert.equal(accessIsIn(initialAccess[1], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('No change', (done) => {
    const newUser = getUser(1);
    const initialAccess = [];
    initialAccess.push(setAccessTo(places[1], 'r'));
    initialAccess.push(setAccessTo(places[2], 'r/w'));
    newUser.access = initialAccess;
    return User.save(newUser).then((user) => {
      User.editAccess(user, initialAccess).then((finalAccess) => {
        assert.equal(initialAccess.length, finalAccess.length);
        assert.equal(accessIsIn(initialAccess[0], finalAccess), true);
        assert.equal(accessIsIn(initialAccess[1], finalAccess), true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
