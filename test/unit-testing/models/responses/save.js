'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Response = require('../../../../server/models/responses');
const Survey = require('../../../../server/models/surveys');
const utils = require('../../../../server/services/utils');
const knex = require('../../../../server/db/knex');


const DEFAULT_ERROR = 'Something went wrong';
const OPTION_NOT_ARRAY = 'Answers should be an array';

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();


function getRandomSurvey() {
  return new Promise((resolve, reject) => {
    Survey.all().then((results) => {
      const survey = utils.randomEntry(results);
      resolve(survey);
    }).catch((err) => {
      reject(err);
    });
  });
}

function createAnswer(option, question) {
  return {
    question_id: question.id,
    answer_option_id: option.id,
  };
}

function createResponseOfSurvey(survey) {
  const response = {
    survey_id: survey.id,
    macaddress: utils.randomInteger(0, 200),
    answers: [],
  };
  const questions = survey.questions;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].options) {
      const selectedOption = utils.randomEntry(questions[i].options);
      const answer = createAnswer(selectedOption, questions[i]);
      response.answers.push(answer);
    }
  }
  return response;
}

function assertEqualAnswers(newResponse, answers) {
  for (let i = 0; i < answers.length; i++) {
    const previousAnswer = answers[i];
    const previousID = parseInt(previousAnswer.question_id, 10);
    let exists = false;
    for (let j = 0; j < newResponse.answers.length; j++) {
      const currentAnswer = newResponse.answers[j];
      const currentID = parseInt(currentAnswer.question_id, 10);
      if (previousID === currentID) {
        assert.equal(currentAnswer.answer_option_id, previousAnswer.answer_option_id);
        exists = true;
      }
    }
    assert.equal(exists, true);
  }
}

function cloneAnswers(response) {
  const answers = [];
  for (let i = 0; i < response.answers.length; i++) {
    answers.push(utils.cloneObject(response.answers[i]));
  }
  return answers;
}


// eslint-disable-next-line no-undef
describe('Responses: save, check it saves the response correctly', () => {
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
  it('Check the response has the correct attributes', (done) => {
    return getRandomSurvey().then((survey) => {
      const response = createResponseOfSurvey(survey);
      Response.save(response).then((savedResponse) => {
        assert.equal(response.survey_id, savedResponse.survey_id);
        assert.equal(response.macaddress, savedResponse.macaddress);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Check that also the answers are saved', (done) => {
    return getRandomSurvey().then((survey) => {
      const response = createResponseOfSurvey(survey);
      const answers = cloneAnswers(response);
      Response.save(response).then((savedResponse) => {
        assert.equal(response.survey_id, savedResponse.survey_id);
        assert.equal(response.macaddress, savedResponse.macaddress);
        savedResponse.answers.should.be.array; // eslint-disable-line
        assertEqualAnswers(savedResponse, answers);
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
describe('Responses:  Malicious save', () => {
  // eslint-disable-next-line no-undef
  it('Create a response with wrong parameters', (done) => {
    const response = {
      survey_id: 'not an id',
    };
    return Response.save(response).then(() => {
      done('it should not get to here');
    }).catch((err) => {
      assert.equal(err, DEFAULT_ERROR);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass invalid answers', (done) => {
    const response = {
      survey_id: 'not an id',
    };
    response.answers = 'not valid';
    return Response.save(response).then(() => {
      done('it should not get to here');
    }).catch((err) => {
      assert.equal(err, OPTION_NOT_ARRAY);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
