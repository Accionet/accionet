// 'use strict';
// process.env.NODE_ENV = 'test';
//
// const chai = require('chai');
// const dateChai = require('chai-datetime');
//
// // const knex = require('../../../../server/db/knex');
// const VisitMetric = require('../../../../../server/models/metrics/visitMetric');
// const Place = require('../../../../../server/newModels/places');
// const utils = require('../../../../../server/services/utils');
//
//
// // const Option = new Options();
//
//
// // eslint-disable-next-line no-unused-vars
// const assert = chai.assert;
// // eslint-disable-next-line no-unused-vars
// const should = chai.should();
//
// chai.use(dateChai);
//
//
// // eslint-disable-next-line no-undef
// describe('VisitMetric: Malicious countEndUsers', () => {
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, without id attribute', (done) => {
//     const place = {
//       key: 'value',
//     };
//     return VisitMetric.countEndUsers(place).then(() => {
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
//     return VisitMetric.countEndUsers(place).then(() => {
//       done('It should not get to here');
//     }).catch(() => {
//       done();
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Pass as parameter something that is a json, with id. But a negative id', (done) => {
//     const place = {
//       place_id: -2,
//     };
//     return VisitMetric.countEndUsers(place).then((response) => {
//       response.should.be.a('number');
//       assert.equal(response, 0);
//       done();
//     }).catch((error) => {
//       done(error);
//     });
//   });
// });
//
// // eslint-disable-next-line no-undef
// describe('VisitMetric: countEndUsers', () => {
//   // eslint-disable-next-line no-undef
//
//
//   // eslint-disable-next-line no-undef
//   it('Check it returns a valid response', (done) => {
//     return Place.all().then((places) => {
//       const randomIndex = utils.randomInteger(0, places.length - 1);
//       const place = places[randomIndex];
//       return VisitMetric.countEndUsers({ place_id: place.id }).then((amount) => {
//         amount.should.be.a('number');
//         done();
//       }).catch((error) => {
//         done(error);
//       });
//     }).catch((error) => {
//       done(error);
//     });
//   });
// });
