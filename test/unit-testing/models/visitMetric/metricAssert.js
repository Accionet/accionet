process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


function assertEmptyValues(entry) {
  for (let i = 0; i < entry.length; i++) {
    assert.equal(entry[i][1], 0);
  }
}

function assertArrayContains24Hours(entry) {
  entry.should.be.a('array');
  assert.equal(entry.length, 24);
  for (let hour = 0; hour < 24; hour++) {
    assert.equal(new Date(entry[hour][0]).getHours(), hour);
  }
}


exports.emptyValues = assertEmptyValues;

exports.arrayContains24Hours = assertArrayContains24Hours;
