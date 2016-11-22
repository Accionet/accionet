'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const AnswerMetric = require('../../../../../server/models/metrics/answerMetric');

// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('AnswerMetric of Question: malicious get', () => {
  // eslint-disable-next-line no-undef
  it('pass invalid question_id', (done) => {
    const id = 'invalid id';
    return AnswerMetric.ofQuestion(id).then(() => {
      done('it should not get to here');
    }).catch((err) => {
      console.log(err);
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('pass question id = null', (done) => {
    const id = null;
    return AnswerMetric.ofQuestion(id).then((metrics) => {
      metrics.should.be.array; // eslint-disable-line
      assert.equal(metrics.length, 0);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('pass question id of no question', (done) => {
    const id = -3;
    return AnswerMetric.ofQuestion(id).then((metrics) => {
      metrics.should.be.array; // eslint-disable-line
      assert.equal(metrics.length, 0);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
