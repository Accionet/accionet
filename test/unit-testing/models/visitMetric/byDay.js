'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const VisitMetric = require('../../../../server/newModels/metrics/visitMetric');
const Place = require('../../../../server/newModels/places');
const utils = require('../../../../server/services/utils');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('VisitMetric: Malicious byDay', () => {
  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, without id attribute', (done) => {
    const place = {
      key: 'value',
    };
    const metrics = new VisitMetric(place);
    return metrics.byDay().then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 0);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. but not a valid id', (done) => {
    const place = {
      id: 'value',
    };
    const metrics = new VisitMetric(place);
    return metrics.byDay().then(() => {
      done('It should not get to here');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. But not a negative id', (done) => {
    const place = {
      id: -2,
    };
    const metrics = new VisitMetric(place);
    return metrics.byDay().then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 0);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});

// eslint-disable-next-line no-undef
describe('VisitMetric: byDay', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Check valid response', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      const metrics = new VisitMetric(place);
      metrics.byDay().then((table) => {
        table.should.be.a('array');
        const randomIndex = utils.randomInteger(0, table.length - 1);
        const entry = table[randomIndex];
        entry.should.be.a('array');
        try {
          const date = new Date(entry[0]); //eslint-disable-line
        } catch (Exception) {
          done('Not a valid date');
        }
        const amount = parseInt(entry[1], 10);
        amount.should.be.a('number');

        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });
});
