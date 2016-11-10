'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const Option = require('../../../../server/newModels/options');

// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


const defaultErrorMessage = 'Find parameter was not defined correctly';
const nonExistantAttibute = 'Parameter contains invalid attributes';
const unvalidJSON = 'Parameter should be a valid json';
const notFoundMessage = 'No se encontró una entrada con id = ';


// eslint-disable-next-line no-undef
describe('Options: Malicious find', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is not a json', (done) => {
    return Option.find(3).then(() => {
      done('Error, it should not return something valid');
    }).catch((err) => {
      assert.equal(unvalidJSON, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Search for a non-existant attribute', (done) => {
    return Option.find({
      someDoestExist: 'a',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(nonExistantAttibute, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Search attribute does not map with type', (done) => {
    return Option.find({
      created_at: 'a',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    })
      .catch((err) => {
        done(err);
      });
  });
});

// eslint-disable-next-line no-undef
describe('Options: Malicious findById', () => {
  // eslint-disable-next-line no-undef
  it('Pass as parameter a negative value', (done) => {
    const id = -3;
    return Option.findById(id).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      err.should.be.string; // eslint-disable-line
      assert.equal(notFoundMessage + id, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Search for NaN', (done) => {
    return Option.findById(NaN).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for Infinity', (done) => {
    return Option.findById(Infinity).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for decimal number', (done) => {
    return Option.findById(2.3).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for unexistant id, be carefully, its hard to know from before hand an unexistant id, so it may fell when it should not', (done) => {
    const id = 23;
    return Option.findById(id).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      err.should.be.string; // eslint-disable-line
      assert.equal(notFoundMessage + id, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for something that is not a valid serial type', (done) => {
    return Option.findById('a').then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
