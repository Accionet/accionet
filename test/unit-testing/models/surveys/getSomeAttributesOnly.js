'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const knex = require('../../../../server/db/knex');
const Survey = require('../../../../server/models/surveys');
// const utils = require('../../../../server/services/utils');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

const expect = chai.expect;


chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Surveys: get only some parameters', () => {
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
  it('Check that contains only two params', (done) => {
    return Survey.find({}, {
      survey: ['id', 'title'],
    }).then((surveys) => {
      for (let i = 0; i < surveys.length; i++) {
        expect(surveys[i]).to.have.all.keys('id', 'title');
      }
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input things that are not valid columns', (done) => {
    return Survey.find({}, {
      survey: ['ititle'],
    }).then((surveys) => {
      assert.deepEqual(surveys, []);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input empty array', (done) => {
    return Survey.find({}, {
      survey: [],
    }).then((surveys) => {
      assert.deepEqual(surveys, []);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input something that is not valid', (done) => {
    return Survey.find({}, 'notValid').then((surveys) => {
      Survey.getAttributesNames().then((attributes) => {
        for (let i = 0; i < surveys.length; i++) {
          expect(surveys[i]).to.have.all.keys(attributes);
        }
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});

// eslint-disable-next-line no-undef
describe('Surveys: get only some parameters of questions and options', () => {
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
  it('Check that contains questions things and options things', (done) => {
    return Survey.find({}, {
      survey: ['id', 'title'],
      questions: ['title', 'type'],
      options: ['enumeration'],
    }).then((surveys) => {
      for (let i = 0; i < surveys.length; i++) {
        const survey = surveys[i];
        expect(survey).to.have.all.keys('id', 'title', 'questions');
        for (let j = 0; j < survey.questions[j].length; j++) {
          const question = survey.questions[j];
          expect(question).to.have.all.keys('title', 'type');
          if (question.type == 'multiple_choice' || true) {
            for (let k = 0; k < question.options.length; k++) {
              expect(question.options[k]).to.have.all.keys('enumeration');
            }
          }
        }
      }
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
