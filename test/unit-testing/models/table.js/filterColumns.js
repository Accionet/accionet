'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const Survey = require('../../../../server/models/surveys');
// const utils = require('../../../../server/services/utils');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

const expect = chai.expect;


chai.use(dateChai);


// eslint-disable-next-line no-undef
describe('Tested on Surveys: Filter columns', () => {
  // eslint-disable-next-line no-undef
  it('Does not delete anything', (done) => {
    return Survey.filterColumns(['id', 'title']).then((surveys) => {
      assert.deepEqual(surveys, ['id', 'title']);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input empty array', (done) => {
    return Survey.filterColumns([]).then((surveys) => {
      assert.equal(surveys.length, 0);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input string', (done) => {
    return Survey.filterColumns('string').then((surveys) => {
      Survey.getAttributesNames().then((attributes) => {
        for (let i = 0; i < surveys.length; i++) {
          expect(surveys[i]).to.have.all.keys(attributes);
        }
      }).catch((err) => {
        done(err);
      });
      done();
    }).catch((err) => {
      done(err);
    });
  });


  // eslint-disable-next-line no-undef
  it('Pass as input undefined', (done) => {
    return Survey.filterColumns(undefined).then((surveys) => {
      Survey.getAttributesNames().then((attributes) => {
        for (let i = 0; i < surveys.length; i++) {
          expect(surveys[i]).to.have.all.keys(attributes);
        }
      }).catch((err) => {
        done(err);
      });
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as input null', (done) => {
    return Survey.filterColumns(null).then((surveys) => {
      Survey.getAttributesNames().then((attributes) => {
        for (let i = 0; i < surveys.length; i++) {
          expect(surveys[i]).to.have.all.keys(attributes);
        }
      }).catch((err) => {
        done(err);
      });
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
