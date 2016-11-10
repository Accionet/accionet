'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

const Question = require('../../../../server/newModels/questions');

// const Option = new Options();
// console.log(Option);


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Questions: save, check it saves the question correctly', () => {
  // eslint-disable-next-line no-undef
  it('Check the question has the correct attributes', (done) => {
    return Question.new().then((question) => {
      question.title = 'New question';
      question.number = 8;
      question.type = 'multiple_choice';
      Question.save(question).then((savedQuestion) => {
        assert.equal(question.title, savedQuestion.title);
        assert.equal(question.number, savedQuestion.number);
        assert.equal(question.type, savedQuestion.type);
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
  it('Check that also the options are saved', (done) => {
    return Question.new().then((question) => {
      question.title = 'New question with options';
      question.number = 8;
      question.type = 'multiple_choice';
      question.options = [{
        statement: 'statement 1',
        enumeration: 'a',
      }, {
        statement: 'statement 2',
        enumeration: 'b',
      }];
      Question.save(question).then((newQuestion) => {
        newQuestion.options.should.be.a('array');
        assert.equal(newQuestion.options.length, question.options.length);
        for (let i = 0; i < question.options.length; i++) {
          let saved = false;
          for (let j = 0; j < newQuestion.options.length; j++) {
            if (question.options[i].statement === newQuestion.options[j].statement) {
              assert.equal(question.options[i].enumeration, newQuestion.options[j].enumeration);
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
