process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
const knex = require('../../../../server/db/knex');
const Question = require('../../../../server/models/questions');
const Survey = require('../../../../server/models/surveys');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);

const NO_SURVEY = 'No se encontró una entrada con id = -8';
const INVALID_QUESTION = 'La pregunta es inválida. Las opciones no están definidas correctamente';
const INVALID_SURVEY = 'La pregunta es inválida. No tiene el atributo id';

// eslint-disable-next-line no-undef
describe('Questions: Malicious update questions of survey', () => {
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
  it('References to invalid survey', (done) => {
    const survey = {
      id: -8,
      questions: [{
        title: 'title',
        number: 2,
      }],
    };
    return Question.updateQuestionsOfSurvey(survey).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(NO_SURVEY, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Dont pass questions', (done) => {
    return Survey.all().then((surveys) => {
      const survey = {
        id: surveys[0].id,
      };
      Question.updateQuestionsOfSurvey(survey).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(INVALID_QUESTION, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as questions something that is not an array', (done) => {
    return Survey.all().then((surveys) => {
      const survey = {
        id: surveys[0].id,
        questions: 3,
      };
      Question.updateQuestionsOfSurvey(survey).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(INVALID_QUESTION, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass not an object as a parameter', (done) => {
    return Question.updateQuestionsOfSurvey('survey').then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(INVALID_SURVEY, err);
      done();
    }).catch((err) => {
      done(err);
    })
      .catch((err) => {
        done(err);
      });
  });
});
// eslint-disable-next-line no-undef
describe('Questions: Update questions of survey', () => {
  // eslint-disable-next-line no-undef
  it('Delete surveys, add new, and modify existing', (done) => {
    return Survey.all().then((surveys) => {
      let survey = {};
      while (!(survey.questions && survey.questions.length > 0)) {
        const i = Math.floor(Math.random() * surveys.length);

        const n = Math.floor(Math.random() * surveys[i].questions.length);
        let cut = 1;
        if (n > 2) {
          cut = 2;
        }
        // delete some questions
        survey = {
          questions: surveys[i].questions.slice().splice(cut),
          id: surveys[i].id,
        };
      }


      // modify
      survey.questions[0].title = 'title modified';


      // add new
      const newQuestion = {
        title: 'new question',
        number: 100,
        type: 'multiple_choice',
        options: [{
          statement: 'statement a',
          enumeration: 'a',
        }, {
          statement: 'statement b',
          enumeration: 'b',
        }],
      };
      survey.questions.push(newQuestion);


      Question.updateQuestionsOfSurvey(survey).then((modifiedSurvey) => {
        assert.equal(modifiedSurvey.id, survey.id);
        assert.equal(modifiedSurvey.questions.length, survey.questions.length);
        let modifiedDone = false;
        let addedDone = false;
        for (let j = 0; j < modifiedSurvey.questions.length; j++) {
          // register if the modified title was register
          if (modifiedSurvey.questions[j].title === survey.questions[0].title) {
            modifiedDone = true;
            assert.equal(modifiedSurvey.questions[j].number, survey.questions[0].number);
          }
          if (modifiedSurvey.questions[j].title === newQuestion.title) {
            assert.equal(modifiedSurvey.questions[j].number, newQuestion.number);
            assert.equal(modifiedSurvey.questions[j].type, newQuestion.type);
            assert.equal(modifiedSurvey.questions[j].options.length, newQuestion.options.length);

            for (let k = 0; k < modifiedSurvey.questions[j].options.length; k++) {
              const option = modifiedSurvey.questions[j].options[k];
              for (let l = 0; l < newQuestion.options.length; l++) {
                if (newQuestion.options[l].statement === option.statement) {
                  assert.equal(option.statement, newQuestion.options[l].statement);
                  assert.equal(option.question_id, newQuestion.options[l].question_id);
                  assert.equal(option.enumeration, newQuestion.options[l].enumeration);
                }
              }
            }
            addedDone = true;
          }
        }
        assert.equal(modifiedDone, true);
        assert.equal(addedDone, true);
        done();
      }).catch((err) => {
        // console.log(err);
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Empty questions, will delete all the questions', (done) => {
    return Survey.all().then((surveys) => {
      const survey = {
        id: surveys[0].id,
        questions: [],
      };
      Question.updateQuestionsOfSurvey(survey).then((survey) => {
        assert.equal(survey.questions.length, 0);
        done();
      }).catch((err) => {
        done(err);
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
