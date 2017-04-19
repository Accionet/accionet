'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');

// const knex = require('../../../../server/db/knex');
const Visits = require('../../../../server/models/visits');
const Place = require('../../../../server/models/places');
const utils = require('../../../../server/services/utils');
const knex = require('../../../../server/db/knex');


// const Option = new Options();


// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// // eslint-disable-next-line no-undef
// describe('Visits: Malicious byDay', () => {
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, without id attribute', (done) => {
//     const place = {
//       key: 'value',
//     };
//     return Visits.byDay(place).then(() => {
//       done('It should not get to here');
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
//     return Visits.byDay(place).then(() => {
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
//     return Visits.byDay(place).then((response) => {
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
// describe('Visits: byDay', () => {
//   // eslint-disable-next-line no-undef
//
//
//   // eslint-disable-next-line no-undef
//   it('Check valid response', (done) => {
//     return Place.all().then((places) => {
//       const randomIndex = utils.randomInteger(0, places.length - 1);
//       const place = places[randomIndex];
//       Visits.byDay({
//         place_id: place.id,
//       }).then((table) => {
//         table.should.be.a('array');
//         const randomIndex = utils.randomInteger(0, table.length - 1);
//         const entry = table[randomIndex];
//         entry.should.be.a('array');
//         try {
//           const date = new Date(entry[0]); //eslint-disable-line
//         } catch (Exception) {
//           done('Not a valid date');
//         }
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
describe('Visits: byDay with timezone changed', () => {
  // eslint-disable-next-line no-undef
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
  it('Check valid response', (done) => {
    return Place.all().then((places) => {
      const randomIndex = utils.randomInteger(0, places.length - 1);
      const place = places[randomIndex];
      Visits.byDay({
        place_id: place.id,
      }).then((noOffset) => {
        Visits.byDay({
          place_id: place.id,
        }, 24 * 60).then((withOffset) => {
          for (let i = 0; i < noOffset.length; i++) {
            // quantities should not change
            assert.equal(noOffset[i][1], withOffset[i][1]);
            // time difference must be 24 hours
            assert.equal(new Date(noOffset[i][0]).getTime() + (24 * 60 * 60 * 1000), new Date(withOffset[i][0]).getTime());
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
