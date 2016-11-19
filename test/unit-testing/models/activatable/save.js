process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
// const knex = require('../../../../server/db/knex');
const Place = require('../../../../server/newModels/places');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Activatable: Save', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Check if is_active not specified, is set to false', (done) => {
    const place = {
      name: 'place',
    };
    return Place.save(place).then((place) => {
      assert.equal(place.is_active, false);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save place with is_active = true', (done) => {
    const place = {
      name: 'place',
      is_active: true,
    };
    return Place.save(place).then((place) => {
      assert.equal(place.is_active, true);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save place with is_active = false', (done) => {
    const place = {
      name: 'place',
      is_active: false,
    };
    return Place.save(place).then((place) => {
      assert.equal(place.is_active, false);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
