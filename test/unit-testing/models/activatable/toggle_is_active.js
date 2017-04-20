'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const Place = require('../../../../server/models/places');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Activatable: toggleIsActive', () => {
  it('toggle from true to false', (done) => { // eslint-disable-line no-undef
    const place = {
      name: 'place',
      is_active: true,
    };
    return Place.save(place).then((place) => {
      Place.toggleIsActive(place.id).then((place) => {
        assert.equal(place.is_active, false);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  it('toggle from false to true', (done) => { // eslint-disable-line no-undef
    const place = {
      name: 'place',
      is_active: false,
    };
    return Place.save(place).then((place) => {
      Place.toggleIsActive(place.id).then((place) => {
        assert.equal(place.is_active, true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
