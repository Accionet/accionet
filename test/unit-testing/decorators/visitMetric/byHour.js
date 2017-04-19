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
// describe('Visit: Malicious byHour', () => {
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, without id attribute', (done) => {
//     const place = {
//       key: 'value',
//     };
//     return Visit.byHour(place).then(() => {
//       done('it should not get to here');
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
//     return Visit.byHour(place).then(() => {
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
//     return Visit.byHour(place).then((response) => {
//       response.should.be.a('array');
//       assert.equal(response.length, 24);
//       metricAssert.arrayContains24Hours(response);
//       metricAssert.emptyValues(response);
//       done();
//     }).catch((error) => {
//       done(error);
//     });
//   });
// });
// // eslint-disable-next-line no-undef
// describe('Visit: byHour', () => {
//   // eslint-disable-next-line no-undef
//
//
//   // eslint-disable-next-line no-undef
//   it('Check it contains the 24 hours in correct order and correct populated.', (done) => {
//     return Place.all().then((places) => {
//       const randomIndex = utils.randomInteger(0, places.length - 1);
//       const place = places[randomIndex];
//       Visit.byHour({ place_id: place.id }).then((entry) => {
//         entry.should.be.a('array');
//         metricAssert.arrayContains24Hours(entry);
//         const amount = parseInt(entry[1], 10);
//         amount.should.be.a('number');
//
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
describe('Visit: byHour different time zones', () => {
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
  it('Compare one with a given timezone to another without. Asumes the minutes_offset will only be complete hours (i.e. 60 is valid but 30 is not)', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      const minutes_offset = 60;
      Visit.byHour({
        place_id: place.id,
      }).then((noOffset) => {
        Visit.byHour({
          place_id: place.id,
        }, minutes_offset).then((withOffset) => {
          assert.equal(withOffset.length, noOffset.length);
          const hourOffset = minutes_offset / 60;
          for (let i = 0; i < noOffset.length; i++) {
            const j = (i + hourOffset) % 24; // index for withOffset
            // correct hour different
            assert.equal(new Date(noOffset[i][0]).getHours(), new Date(withOffset[j][0]).getHours());
            // correct amount
            assert.equal(noOffset[i][0], withOffset[j][0]);
          }
          done();
        }).catch((error) => {
          done(error);
        });
      }).catch((error) => {
        done(error);
      });
    });
  });
});
