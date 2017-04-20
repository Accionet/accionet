'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const Survey = require('../../../../../server/models/surveys');
const Question = require('../../../../../server/models/questions');
const Option = require('../../../../../server/models/options');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

const expect = chai.expect;


chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Surveys: get only some parameters', () => {
  // eslint-disable-next-line no-undef
  it('Check that contains only two params', (done) => {
    return Survey.find({}, {
      surveys: ['id', 'title'],
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
      surveys: ['ititle'],
    }).then((surveys) => {
      Survey.getAttributesNames().then((attributes) => {
        for (let i = 0; i < surveys.length; i++) {
          expect(surveys[i]).to.have.all.keys(attributes);
        }
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input empty array', (done) => {
    return Survey.find({}, {
      surveys: [],
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
        done();
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
  it('Check that contains questions things and options things', (done) => {
    return Survey.find({}, {
      surveys: ['id', 'title'],
      questions: ['title', 'type'],
      options: ['enumeration'],
    }).then((surveys) => {
      for (let i = 0; i < surveys.length; i++) {
        const survey = surveys[i];
        expect(survey).to.have.all.keys('id', 'title', 'questions');
        for (let j = 0; j < survey.length; j++) {
          const question = survey.questions[j];
          expect(question).to.have.all.keys('title', 'type');
          for (let k = 0; k < question.length; k++) {
            expect(question.options[k]).to.have.all.keys('enumeration');
          }
        }
      }
      done();
    }).catch((err) => {
      done(err);
    });
  });
});


// eslint-disable-next-line no-undef
describe('Surveys: use Survey: "all" to get everything', () => {
  // eslint-disable-next-line no-undef
  it('Check that contains questions things and options things', (done) => {
    return Survey.find({}, {
      surveys: 'all',
      questions: 'all',
      options: 'all',
    }).then((surveys) => {
      Survey.getAttributesNames().then((attributesSurvey) => {
        Question.getAttributesNames().then((attributesQuestion) => {
          Option.getAttributesNames().then((optionAttributes) => {
            attributesSurvey.push('questions');
            attributesQuestion.push('options');

            for (let i = 0; i < surveys.length; i++) {
              const survey = surveys[i];
              expect(survey).to.have.all.keys(attributesSurvey);
              for (let j = 0; j < survey.questions.length; j++) {
                const question = survey.questions[j];
                expect(question).to.have.all.keys(attributesQuestion);
                for (let k = 0; k < question.options.length; k++) {
                  expect(question.options[k]).to.have.all.keys(optionAttributes);
                }
              }
            }
            done();
          }).catch((err) => {
            done(err);
          });
        }).catch((err) => {
          done(err);
        });
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
