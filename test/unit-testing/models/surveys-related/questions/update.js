'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Question = require('../../../../../server/models/questions');
const utils = require('../../../../../server/services/utils');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


// eslint-disable-next-line no-undef
describe('Questions: update, check if the question updates correctly', () => {
  // eslint-disable-next-line no-undef
  it('Do not update options', (done) => {
    return Question.all().then((questions) => {
      questions.should.be.a('array');
      questions.length.should.be.a('number');
      const r = utils.randomInteger(0, questions.length - 1);
      const question = utils.cloneObject(questions[r]);
      question.title = 'updated title';
      Question.update(question.id, question).then((modifiedQuestion) => {
        assert.equal(modifiedQuestion.title, question.title);
        assert.equal(modifiedQuestion.type, questions[r].type);
        assert.equal(modifiedQuestion.number, questions[r].number);
        let numberOfEqualOptions = 0;
        if (modifiedQuestion.options) {
          for (let i = 0; i < modifiedQuestion.options.length; i++) {
            for (let j = 0; j < questions[r].options.length; j++) {
              if (modifiedQuestion.options[i].statement === questions[r].options[j].statement) {
                assert.equal(modifiedQuestion.options[i].statement, questions[r].options[j].statement);
                assert.equal(modifiedQuestion.options[i].enumeration, questions[r].options[j].enumeration);
                assert.equal(modifiedQuestion.options[i].question_id, questions[r].options[j].question_id);
                numberOfEqualOptions++;
              }
            }
          }
          assert.equal(numberOfEqualOptions, modifiedQuestion.options.length);
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
  it('Update question and options', (done) => {
    return Question.all().then((questions) => {
      questions.should.be.a('array');
      questions.length.should.be.a('number');
      let question = {};
      let r;
      while (!question.options) {
        r = utils.randomInteger(0, questions.length - 1);
        question = utils.cloneObject(questions[r]);
      }
      question.title = 'updated title';
      // check that the options are well defined
      question.options.should.be.a('array');
      question.options.length.should.be.a('number');

      question.options[0].statement = 'new statement';
      Question.update(question.id, question).then((modifiedQuestion) => {
        assert.equal(modifiedQuestion.title, question.title);
        assert.equal(modifiedQuestion.type, questions[r].type);
        assert.equal(modifiedQuestion.number, questions[r].number);
        let modifiedDone = false;
        for (let i = 0; i < modifiedQuestion.options.length; i++) {
          if (modifiedQuestion.options[i].statement === 'new statement') {
            modifiedDone = true;
          }
          for (let j = 0; j < question.options.length; j++) {
            if (modifiedQuestion.options[i].statement === question.options[j].statement) {
              assert.equal(modifiedQuestion.options[i].statement, question.options[j].statement);
              assert.equal(modifiedQuestion.options[i].enumeration, question.options[j].enumeration);
              assert.equal(modifiedQuestion.options[i].question_id, question.options[j].question_id);
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
