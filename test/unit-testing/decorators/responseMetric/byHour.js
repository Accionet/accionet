'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const Response = require('../../../../server/models/responses');
const Survey = require('../../../../server/models/surveys');
const utils = require('../../../../server/services/utils');
const metricAssert = require('../../models/metrics/metricAssert');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Response: Malicious byHour', () => {
  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, without id attribute', (done) => {
    const survey = {
      key: 'value',
    };
    return Response.byHour(survey).then(() => {
      done('it should not get to here');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. but not a valid id', (done) => {
    const survey = {
      survey_id: 'value',
    };
    return Response.byHour(survey).then(() => {
      done('It should not get to here');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is a json, with id. But not a negative id', (done) => {
    const survey = {
      survey_id: -2,
    };
    return Response.byHour(survey).then((response) => {
      response.should.be.a('array');
      assert.equal(response.length, 24);
      metricAssert.arrayContains24Hours(response);
      metricAssert.emptyValues(response);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
// eslint-disable-next-line no-undef
describe('Response: byHour', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Check it contains the 24 hours in correct order and correct populated.', (done) => {
    return Survey.all().then((surveys) => {
      const randomIndex = utils.randomInteger(0, surveys.length - 1);
      const survey = surveys[randomIndex];
      Response.byHour({ survey_id: survey.id }).then((entry) => {
        entry.should.be.a('array');
        metricAssert.arrayContains24Hours(entry);
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
