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
describe('VisitMetric: Malicious byHour', () => {
  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, without id attribute', (done) => {
    const place = {
      key: 'value',
    };
    const metrics = new VisitMetric(place);
    return metrics.byHour().then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 24);
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
    return metrics.byHour().then(() => {
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
    return metrics.byHour().then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 24);
      assertArrayContains24Hours(response);
      assertEmptyValues(response);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});

function assertEmptyValues(entry) {
  for (let i = 0; i < entry.length; i++) {
    assert.equal(entry[i][1], 0);
  }
}


function assertArrayContains24Hours(entry) {
  entry.should.be.a('array');
  assert.equal(entry.length, 24);
  for (let hour = 0; hour < 24; hour++) {
    assert.equal(new Date(entry[hour][0]).getHours(), hour);
  }
}
// eslint-disable-next-line no-undef
describe('VisitMetric: byHour', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Check it contains the 24 hours in correct order and correct populated.', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      const metrics = new VisitMetric(place);
      metrics.byHour().then((entry) => {
        entry.should.be.a('array');
        assertArrayContains24Hours(entry);
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
