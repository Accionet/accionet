'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Survey = require('../../../../server/models/surveys');
const utils = require('../../../../server/services/utils');
const knex = require('../../../../server/db/knex');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


// eslint-disable-next-line no-undef
describe('Surveys: update, check if the survey updates correctly', () => {
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
  it('Do not update questions', (done) => {
    return Survey.all().then((surveys) => {
      surveys.should.be.a('array');
      surveys.length.should.be.a('number');
      const r = utils.randomInteger(0, surveys.length - 1);
      const survey = utils.cloneObject(surveys[r]);
      survey.title = 'updated title';
      Survey.update(survey.id, survey).then((modifiedSurvey) => {
        assert.equal(modifiedSurvey.title, survey.title);
        assert.equal(modifiedSurvey.description, surveys[r].description);
        assert.equal(modifiedSurvey.is_active, surveys[r].is_active);
        let numberOfEqualQuestions = 0;
        if (modifiedSurvey.questions) {
          for (let i = 0; i < modifiedSurvey.questions.length; i++) {
            for (let j = 0; j < surveys[r].questions.length; j++) {
              if (modifiedSurvey.questions[i].title === surveys[r].questions[j].title) {
                assert.equal(modifiedSurvey.questions[i].number, surveys[r].questions[j].number);
                assert.equal(modifiedSurvey.questions[i].type, surveys[r].questions[j].type);
                if (modifiedSurvey.questions[i].type === 'multiple_choice') {
                  assert.equal(modifiedSurvey.questions[i].options.length, surveys[r].questions[j].options.length);
                  for (let k = 0; k < modifiedSurvey.questions[i].options.length; k++) {
                    for (let l = 0; l < surveys[r].questions[j].options.length; l++) {
                      if (modifiedSurvey.questions[i].options[k].statement === surveys[r].questions[j].options[l].statement) {
                        assert.equal(modifiedSurvey.questions[i].options[k].enumeration, surveys[r].questions[j].options[l].enumeration);
                      }
                    }
                  }
                }
                numberOfEqualQuestions++;
              }
            }
          }
          assert.equal(numberOfEqualQuestions, modifiedSurvey.questions.length);
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
  it('Update survey and questions', (done) => {
    return Survey.all().then((surveys) => {
      surveys.should.be.a('array');
      surveys.length.should.be.a('number');
      let survey = {};
      let r;
      let qi;
      while (!survey.questions || (survey.questions.length === 0) || !survey.questions[qi].options) {
        r = utils.randomInteger(0, surveys.length - 1);
        survey = utils.cloneObject(surveys[r]);
        qi = utils.randomInteger(0, survey.questions.length - 1);
      }
      survey.title = 'updated title';
      // check that the questions are well defined
      survey.questions.should.be.a('array');
      survey.questions.length.should.be.a('number');

      survey.questions[qi].title = 'new question title';

      survey.questions[qi].options.should.be.a('array');
      survey.questions[qi].options.length.should.be.a('number');
      survey.questions[qi].options[0].statement = 'new statement';
      Survey.update(survey.id, survey).then((modifiedSurvey) => {
        assert.equal(modifiedSurvey.title, survey.title);
        assert.equal(modifiedSurvey.description, surveys[r].description);
        assert.equal(modifiedSurvey.is_active, surveys[r].is_active);
        let modifiedDone = false;
        for (let i = 0; i < modifiedSurvey.questions.length; i++) {
          let currentQuestionIsModified = false;
          if (modifiedSurvey.questions[i].title === 'new question title') {
            currentQuestionIsModified = true;
            modifiedDone = true;
          }
          for (let j = 0; j < survey.questions.length; j++) {
            if (modifiedSurvey.questions[i].title === survey.questions[j].title) {
              assert.equal(modifiedSurvey.questions[i].title, survey.questions[j].title);
              assert.equal(modifiedSurvey.questions[i].type, survey.questions[j].type);
              assert.equal(modifiedSurvey.questions[i].number, survey.questions[j].number);
              assert.equal(modifiedSurvey.questions[i].survey_id, survey.questions[j].survey_id);
              if (modifiedSurvey.questions[i].type === 'multiple_choice') {
                assert.equal(modifiedSurvey.questions[i].options.length, surveys[r].questions[j].options.length);
                let modifiedOption = false;
                for (let k = 0; k < modifiedSurvey.questions[i].options.length; k++) {
                  if (modifiedSurvey.questions[i].options[k].statement === 'new statement') {
                    modifiedOption = true;
                  }
                  for (let l = 0; l < surveys[r].questions[j].options.length; l++) {
                    if (modifiedSurvey.questions[i].options[k].statement === surveys[r].questions[j].options[l].statement) {
                      assert.equal(modifiedSurvey.questions[i].options[k].enumeration, surveys[r].questions[j].options[l].enumeration);
                    }
                  }
                }
                if (currentQuestionIsModified) {
                  assert.equal(modifiedOption, true);
                }
              }
            }
          }
        }
        assert.equal(modifiedDone, true);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
