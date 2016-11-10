// 'use strict';
// process.env.NODE_ENV = 'test';
//
// const chai = require('chai');
// const dateChai = require('chai-datetime');
//
// const knex = require('../../../../server/db/knex');
// const Question = require('../../../../server/newModels/questions');
//
// // const Option = new Options();
// // console.log(Option);
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
// describe('Questions: check that the options come with', () => {
//   // eslint-disable-next-line no-undef
//   before((done) => {
//     return knex.seed.run()
//       .then(() => {
//         done();
//       }).catch((err) => {
//         done(err);
//       });
//   });
//   // eslint-disable-next-line no-undef
//   it('for: all', (done) => {
//     return Question.all().then((questions) => {
//       const question = questions[Math.floor(Math.random() * questions.length)];
//       if (question.type === 'multiple_choice') {
//         question.options.should.be.a('array'); // eslint-disable-line
//         assert.notEqual(question.options.length, 0);
//       }
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//   // eslint-disable-next-line no-undef
//   it('for: find by Id', (done) => {
//     return Question.all().then((questions) => {
//       const id = questions[Math.floor(Math.random() * questions.length)].id;
//       Question.findById(id).then((question) => {
//         assert.equal(id, question.id);
//         if (question.type === 'multiple_choice') {
//             question.options.should.be.a('array'); // eslint-disable-line
//           assert.notEqual(question.options.length, 0);
//           const n = Math.floor(Math.random() * question.options.length);
//           assert.equal(question.options[n].question_id, question.id);
//           question.options[n].id.should.be.an('number');
//           question.options[n].enumeration.should.be.an('string');
//           question.options[n].statement.should.be.an('string');
//         }
//         done();
//       })
//         .catch((err) => {
//           done(err);
//         });
//     }).catch((err) => {
//       done(err);
//     });
//   });
//   //   Question.findById(id).then(() => {
//   //     done('Error, it should return something valid');
//   //   }).catch((err) => {
//   //     err.should.be.string; // eslint-disable-line
//   //     assert.equal(notFoundMessage + id, err);
//   //     done();
//   //   }).catch((err) => {
//   //     done(err);
//   //   });
//   // });
// });
