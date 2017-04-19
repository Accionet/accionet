'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const Visit = require('../../../../server/models/visits');
const Place = require('../../../../server/models/places');
const utils = require('../../../../server/services/utils');
const metricAssert = require('../../models/metrics/metricAssert');
const knex = require('../../../../server/db/knex');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// // eslint-disable-next-line no-undef
// describe('Visit: Malicious tableDateAndHour', () => {
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, without id attribute', (done) => {
//     const place = {
//       key: 'value',
//     };
//     return Visit.tableDateAndHour(place).then(() => {
//       done('it should not return something valid');
//     }).catch(() => {
//       done();
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, with id. but not a valid id', (done) => {
//     const place = {
//       place_id: 'value',
//     };
//     return Visit.tableDateAndHour(place).then(() => {
//       done('It should not get to here');
//     }).catch(() => {
//       done();
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, with id. But not a negative id', (done) => {
//     const place = {
//       place_id: -2,
//     };
//     return Visit.tableDateAndHour(place).then((response) => {
//       response.should.be.a('array');
//       assert.equal(response.length, 0);
//       done();
//     }).catch((error) => {
//       done(error);
//     });
//   });
// });
//
// // eslint-disable-next-line no-undef
// describe('Visit: tableDateAndHour', () => {
//   // eslint-disable-next-line no-undef
//
//
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, without id attribute', (done) => {
//     return Place.all().then((places) => {
//       const randomIndex = utils.randomInteger(0, places.length - 1);
//       const place = places[randomIndex];
//       return Visit.tableDateAndHour({ place_id: place.id }).then((table) => {
//         table.should.be.a('array');
//         const randomIndex = utils.randomInteger(0, table.length - 1);
//         const entry = table[randomIndex];
//         entry.should.have.property('label');
//         entry.should.have.property('data');
//         metricAssert.arrayContains24Hours(entry.data);
//         entry.data.should.be.array; // eslint-disable-line
//         done();
//       }).catch((error) => {
//         done(error);
//       });
//     }).catch((error) => {
//       done(error);
//     });
//   });
// });

// eslint-disable-next-line no-undef
describe('Visit: tableDateAndHour with timezone', () => {
  let bd_offset = 0;
  // eslint-disable-next-line no-undef
  before((done) => {
    return Promise.all([knex.raw('SELECT EXTRACT(TIMEZONE from now()) as sec_offset')])
      .then((results) => {
        bd_offset = results[0].rows[0].sec_offset / 60;
        done();
      }).catch((err) => {
        done(err);
      });
  });

  // eslint-disable-next-line no-undef
  it('Check for a given amount of hours ', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      const offset = 60 * 2;
      return Visit.tableDateAndHour({ place_id: place.id }).then((noOffset) => {
        return Visit.tableDateAndHour({ place_id: place.id }, offset).then((withOffset) => {
          const hourOffset = (offset - bd_offset) / 60;
          for (let i = 0; i < noOffset.length; i++) {
            for (let j = 0; j < noOffset[i].data.length; j++) {
              const m = (j + hourOffset) % 24;
              const n = (((j + hourOffset) > 24) ? i + 1 : i);
              assert.equal(noOffset[i].data[j][1], withOffset[n].data[m][1]);
            }
          }
          done();
        }).catch((error) => {
          done(error);
        });
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });
});
