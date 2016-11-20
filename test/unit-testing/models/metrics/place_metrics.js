process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
const knex = require('../../../../server/db/knex');
const Place = require('../../../../server/models/places');
const utils = require('../../../../server/services/utils');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Place Metrics: Check json has correct attributes', () => {
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
  it('Count amount of options', (done) => {
    return Place.all().then((places) => {
      const place = utils.randomEntry(places);
      Place.metrics(place.id).then((metrics) => {
        metrics.should.have.property('daily');
        metrics.should.have.property('hourly');
        metrics.should.have.property('table');
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
