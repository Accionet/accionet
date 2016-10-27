process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
// const knex = require('../../../../server/db/knex');
const Option = require('../../../../server/newModels/options');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


const defaultErrorMessage = 'Find parameter was not defined correctly';


// eslint-disable-next-line no-undef
describe('Options: Malicious find', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is not a json', (done) => {
    const unvalidJSON = 'Find parameter should be a valid json';
    Option.find(3).then(() => {
      done('Error, it should not return something valid');
    }).catch((err) => {
      assert.equal(unvalidJSON, err);
      done();
    });
  });

  const nonExistantAttibute = 'Find parameter contains attributes that cannot be searched for';
  // eslint-disable-next-line no-undef
  it('Search for a non-existant attribute', (done) => {
    Option.find({
      someDoestExist: 'a',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(nonExistantAttibute, err);
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Search attribute does not map with type', (done) => {
    Option.find({
      created_at: 'a',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    });
  });
});

// eslint-disable-next-line no-undef
describe('Options: Malicious findById', () => {
  const notFoundMessage = 'No se encontró una entrada con id = ';

  // eslint-disable-next-line no-undef
  it('Pass as parameter a negative value', (done) => {
    const id = -3;
    Option.findById(id).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      err.should.be.string; // eslint-disable-line
      assert.equal(notFoundMessage + id, err);
      done();
    });
  });

  // eslint-disable-next-line no-undef
  it('Search for NaN', (done) => {
    Option.findById(NaN).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for Infinity', (done) => {
    Option.findById(Infinity).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for decimal number', (done) => {
    Option.findById(2.3).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for unexistant id, be carefully, its hard to know from before hand an unexistant id, so it may fell when it should not', (done) => {
    const id = 23;
    Option.findById(id).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      err.should.be.string; // eslint-disable-line
      assert.equal(notFoundMessage + id, err);
      done();
    });
  });
  // eslint-disable-next-line no-undef
  it('Search for something that is not a valid serial type', (done) => {
    Option.findById('a').then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    });
  });
});
