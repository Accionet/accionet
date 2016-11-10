// process.env.NODE_ENV = 'test';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../app');
// const knex = require('../server/db/knex');
//
// // eslint-disable-next-line no-unused-vars
// const should = chai.should();
//
// chai.use(chaiHttp);
//
// // eslint-disable-next-line no-undef
// describe('API Routes', () => {
//   // eslint-disable-next-line no-undef
//   beforeEach((done) => {
//     knex.migrate.rollback()
//       .then(() => {
//         knex.migrate.latest()
//           .then(() => {
//             return knex.seed.run()
//               .then(() => {
//                 done();
//               });
//           });
//       });
//   });
//   // eslint-disable-next-line no-undef
//   afterEach((done) => {
//     knex.migrate.rollback()
//       .then(() => {
//         done();
//       });
//   });
// });
//
// // const baseUrl = '/api/v1/surveys';
// // // eslint-disable-next-line no-undef
// // describe('Test: Count the total amount of surveys ', () => {
// //   // eslint-disable-next-line no-undef
// //   it('Should return a json object with the property amount = 3', (done) => {
// //     chai.request(server)
// //       .get('/surveys/count')
// //       .end((err, res) => {
// //         res.should.have.status(200);
// //         res.should.be.json; // eslint-disable-line no-unused-expressions
// //         res.body.should.have.property('message');
// //         res.body.message.should.equal('Encuestas contadas exitosamente');
// //         res.body.should.have.property('amount');
// //         res.body.amount.should.equal('3');
// //
// //         done();
// //       });
// //   });
// // });
//
// // // eslint-disable-next-line no-undef
// // describe('Test: Toggle the is_active attribute ', () => {
// //   // eslint-disable-next-line no-undef
// //   it('Toggle is_active of surveys', (done) => {
// //     knex.table('surveys').select().then((surveys) => {
// //       for (let i = 0; i < surveys.length; i++) {
// //         chai.request(server)
// //           .put(`/surveys/${surveys[i].id}/toggleIsActive`)
// //           .end((err, res) => {
// //             res.should.have.status(200);
// //             res.should.be.json; // eslint-disable-line no-unused-expressions
// //             res.body.should.have.property('message');
// //             res.body.message.should.equal('Encuestas contadas exitosamente');
// //             res.body.should.have.property('amount');
// //             res.body.amount.should.equal(3);
// //             done();
// //           });
// //       }
// //     });
// //   });
// // });
