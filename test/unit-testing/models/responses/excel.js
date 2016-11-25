'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');

const Response = require('../../../../server/models/responses');
const Survey = require('../../../../server/models/surveys');
const utils = require('../../../../server/services/utils');
const knex = require('../../../../server/db/knex');


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

function assertQuestionInSurvey(excelData, survey) {
  for (let i = 0; i < excelData.length; i++) {
    const entry = excelData[i];
    let exists = false;
    for (let i = 0; i < survey.questions.length; i++) {
      if (survey.questions[i].title === entry.pregunta) {
        exists = true;
      }
    }
    assert.equal(exists, true);
  }
}

// eslint-disable-next-line no-undef
describe('Responses Excel: check correct attributes', () => {
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
      const attr = {
        survey_id: survey.id,
      };
      Response.dataForExcel(attr).then((excelData) => {
        excelData.should.be.array; // eslint-disable-line
        const entry = utils.randomEntry(excelData);
        entry.should.have.property('contestacion');
        entry.should.have.property('ingresada');
        entry.should.have.property('macaddress');
        entry.should.have.property('ultima actualizacion');
        entry.should.have.property('N. de la pregunta');
        entry.should.have.property('pregunta');
        entry.should.have.property('respuesta');
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Check that the questions given correspond to the survey ', (done) => {
    return getRandomSurvey().then((survey) => {
      const attr = {
        survey_id: survey.id,
      };
      Response.dataForExcel(attr).then((excelData) => {
        assertQuestionInSurvey(excelData, survey);
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
describe('Excel for Response:  Malicious', () => {
  // eslint-disable-next-line no-undef
  it('Pass not valid survey id', (done) => {
    const attr = {
      survey_id: 'this is not an id',
    };
    return Response.dataForExcel(attr).then(() => {
      done('it should not get to here');
    }).catch(() => {
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as attr more params', (done) => {
    const attr = {
      survey_id: 'this is not an id',
      other_stuff: 'More and more stuff',
    };
    return Response.dataForExcel(attr).then(() => {
      done('it should not get to here');
    }).catch(() => {
      done();
    });
  });
});
