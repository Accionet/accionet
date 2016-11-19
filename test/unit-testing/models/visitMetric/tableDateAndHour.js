'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const VisitMetric = require('../../../../server/models/metrics/visitMetric');
const Place = require('../../../../server/newModels/places');
const utils = require('../../../../server/services/utils');
const metricAssert = require('./metricAssert');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('VisitMetric: Malicious tableDateAndHour', () => {
  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, without id attribute', (done) => {
    const place = {
      key: 'value',
    };
    return VisitMetric.tableDateAndHour(place).then(() => {
      done('it should not return something valid');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. but not a valid id', (done) => {
    const place = {
      place_id: 'value',
    };
    return VisitMetric.tableDateAndHour(place).then(() => {
      done('It should not get to here');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. But not a negative id', (done) => {
    const place = {
      place_id: -2,
    };
    return VisitMetric.tableDateAndHour(place).then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 0);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});

// eslint-disable-next-line no-undef
describe('VisitMetric: tableDateAndHour', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, without id attribute', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      return VisitMetric.tableDateAndHour({ place_id: place.id }).then((table) => {
        table.should.be.a('array');
        const randomIndex = utils.randomInteger(0, table.length - 1);
        const entry = table[randomIndex];
        entry.should.have.property('label');
        entry.should.have.property('data');
        metricAssert.arrayContains24Hours(entry.data);
        entry.data.should.be.array; // eslint-disable-line
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });
});
