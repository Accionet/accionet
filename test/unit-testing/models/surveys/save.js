'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Survey = require('../../../../server/models/surveys');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

const QUESTION_NOT_ARRAY = 'Questions should be an array';
const WRONG_PARAMETER = 'Parameter contains invalid attributes';


function getQuestions() {
  return [{
    title: 'first question',
    number: 1,
    type: 'multiple_choice',
    options: [{
      statement: 'statement 1',
      enumeration: 'a',
    }, {
      statement: 'statement 2',
      enumeration: 'b',
    }],
  }, {
    title: 'second question',
    number: 2,
    type: 'multiple_choice',
    options: [{
      statement: 'statement 3',
      enumeration: 'a',
    }, {
      statement: 'statement 4',
      enumeration: 'b',
    }],
  }];
}

// eslint-disable-next-line no-undef
describe('Surveys: save, check it saves the survey correctly', () => {
  // eslint-disable-next-line no-undef
  it('Check the survey has the correct attributes', (done) => {
    return Survey.new().then((survey) => {
      survey.title = 'New survey';
      survey.description = 'description of survey';
      survey.is_active = true;
      Survey.save(survey).then((savedSurvey) => {
        assert.equal(survey.title, savedSurvey.title);
        assert.equal(survey.description, savedSurvey.description);
        assert.equal(survey.is_active, savedSurvey.is_active);
        done();
      })
        .catch((err) => {
          done(err);
        });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Check that also the questions are saved', (done) => {
    return Survey.new().then((survey) => {
      survey.title = 'New survey with questions';
      survey.questions = getQuestions();
      Survey.save(survey).then((newSurvey) => {
        newSurvey.questions.should.be.a('array');
        assert.equal(newSurvey.questions.length, survey.questions.length);
        for (let i = 0; i < survey.questions.length; i++) {
          let saved = false;
          for (let j = 0; j < newSurvey.questions.length; j++) {
            if (survey.questions[i].title === newSurvey.questions[j].title) {
              assert.equal(survey.questions[i].number, newSurvey.questions[j].number);
              assert.equal(survey.questions[i].type, newSurvey.questions[j].type);
              if (survey.questions[i].type === 'multiple_choice') {
                for (let k = 0; k < survey.questions[i].options.length; k++) {
                  for (let l = 0; l < newSurvey.questions[j].options.length; l++) {
                    if (survey.questions[i].options[k].statement === newSurvey.questions[j].options[l].statement) {
                      assert.equal(survey.questions[i].options[k].enumeration, newSurvey.questions[j].options[l].enumeration);
                    }
                  }
                }
              }
              saved = true;
            }
          }
          assert(saved, true);
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
describe('Surveys:  Malicious save', () => {
  // eslint-disable-next-line no-undef
  it('Create a survey with wrong parameters', (done) => {
    return Survey.new().then((survey) => {
      survey.title = 'New survey';
      survey.number = 'not a number';
      survey.type = 'another tye';
      Survey.save(survey).then(() => {
        done('it should not get to here');
      }).catch((err) => {
        assert.equal(err, WRONG_PARAMETER);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Pass invalid questions', (done) => {
    return Survey.new().then((survey) => {
      survey.title = 'New survey with questions';
      survey.description = 'description';
      survey.questions = 'not valid';
      Survey.save(survey).then(() => {
        done('it should not get to here');
      }).catch((err) => {
        assert.equal(err, QUESTION_NOT_ARRAY);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
