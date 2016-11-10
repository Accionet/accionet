'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const knex = require('../../../../server/db/knex');
const Survey = require('../../../../server/newModels/surveys');
const utils = require('../../../../server/services/utils');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Surveys: check that the questions and options come with', () => {
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
  it('for: all', (done) => {
    return Survey.all().then((surveys) => {
      console.log('no llego para aca o si?');
      const survey = surveys[utils.randomInteger(0, surveys.length - 1)];
      survey.questions.should.be.a('array');
      for (let i = 0; i < survey.questions.length; i++) {
        if (survey.questions[i].type === 'multiple_choice') {
          survey.questions[i].options.should.be.a('array'); // eslint-disable-line
          assert.notEqual(survey.questions[i].options.length, 0);
        }
      }
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('for: find by Id', (done) => {
    return Survey.all().then((surveys) => {
      const id = surveys[utils.randomInteger(0, surveys.length - 1)].id;
      Survey.findById(id).then((survey) => {
        survey.questions.should.be.a('array');
        for (let i = 0; i < survey.questions.length; i++) {
          if (survey.questions[i].type === 'multiple_choice') {
            survey.questions[i].options.should.be.a('array'); // eslint-disable-line
            assert.notEqual(survey.questions[i].options.length, 0);
          }
        }
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
