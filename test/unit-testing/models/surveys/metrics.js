'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Survey = require('../../../../server/models/surveys');

const utils = require('../../../../server/services/utils');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


function assertEachQuestionHasMetrics(survey) {
  for (let i = 0; i < survey.questions.length; i++) {
    survey.questions[i].should.have.property('metrics');
  }
}

// eslint-disable-next-line no-undef
describe('Surveys: get Metrics', () => {
  // eslint-disable-next-line no-undef
  it('Check the survey has the correct attributes', (done) => {
    return Survey.all().then((results) => {
      const survey = utils.randomEntry(results);
      Survey.getMetrics(survey.id).then((survey) => {
        assertEachQuestionHasMetrics(survey);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
