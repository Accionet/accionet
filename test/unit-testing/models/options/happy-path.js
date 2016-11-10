process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
const knex = require('../../../../server/db/knex');
const Option = require('../../../../server/newModels/options');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);


// // eslint-disable-next-line no-undef
// describe('Options: Methods that dont modify the db. (Count, find, all, new, getFirstDate, getAttributesNames)', () => {
//   // eslint-disable-next-line no-undef
//   before((done) => {
//     return knex.seed.run()
//       .then(() => {
//         done();
//       }).catch((err) => {
//         done(err);
//       });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Count amount of options', (done) => {
//     return Option.count().then((c) => {
//       assert.equal(c, 45);
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//   // eslint-disable-next-line no-undef
//   it('Get all options, then find it by id and comparte', (done) => {
//     return Option.all().then((options) => {
//       assert.equal(options.length, 45);
//       options.should.be.array; //eslint-disable-line
//       const i = Math.floor(Math.random() * 45);
//       options[i].should.have.property('id');
//       options[i].should.have.property('created_at');
//       options[i].should.have.property('updated_at');
//       options[i].should.have.property('statement');
//       options[i].should.have.property('enumeration');
//       options[i].should.have.property('question_id');
//       Option.findById(options[i].id).then((option) => {
//         option.should.have.property('id');
//         assert.equal(option.id, options[i].id);
//         option.should.have.property('created_at');
//         assert.equal(option.created_at, options[i].created_at);
//         option.should.have.property('updated_at');
//         assert.equal(option.updated_at, options[i].updated_at);
//         option.should.have.property('statement');
//         assert.equal(option.statement, options[i].statement);
//         option.should.have.property('enumeration');
//         assert.equal(option.enumeration, options[i].enumeration);
//         option.should.have.property('question_id');
//         assert.equal(option.question_id, options[i].question_id);
//         done();
//       }).catch((err) => {
//         done(err);
//       });
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Test the find method with enumeration: "d"', (done) => {
//     return Option.find({
//       enumeration: 'd',
//     }).then((options) => {
//       assert.equal(options.length, 6);
//       options.should.be.array; //eslint-disable-line
//       const i = Math.floor(Math.random() * 6);
//       options[i].should.have.property('id');
//       options[i].should.have.property('created_at');
//       options[i].should.have.property('updated_at');
//       options[i].should.have.property('statement');
//       options[i].should.have.property('enumeration');
//       assert.equal(options[i].enumeration, 'd');
//       options[i].should.have.property('question_id');
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Find something that does not exists', (done) => {
//     return Option.find({
//       enumeration: 'dasdf',
//     }).then((options) => {
//       assert.equal(options.length, 0);
//       options.should.be.array; // eslint-disable-line
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Get the first date', (done) => {
//     return Option.getFirstDate().then((date) => {
//       date.should.be.date; //eslint-disable-line
//       done();
//     }).catch((err) => {
//       assert.equal('No se encontró una respuesta válida', err);
//       done();
//     });
//   });
//   // eslint-disable-next-line no-undef
//   it('Get the attributes', (done) => {
//     return Option.getAttributesNames().then((attr) => {
//       attr.should.be.array; // eslint-disable-line
//       assert.equal(attr.length, 6);
//       attr.should.contain('id');
//       attr.should.contain('created_at');
//       attr.should.contain('updated_at');
//       attr.should.contain('statement');
//       attr.should.contain('enumeration');
//       attr.should.contain('question_id');
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Get new empty option', (done) => {
//     return Option.new().then((option) => {
//       option.should.have.property('id');
//       option.should.have.property('created_at');
//       option.should.have.property('updated_at');
//       option.should.have.property('statement');
//       option.should.have.property('enumeration');
//       option.should.have.property('question_id');
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
// });
//
// // eslint-disable-next-line no-undef
// describe('Options: See what happens with empty table. (Count, find, all, new, getFirstDate, getAttributesNames)', () => {
//   // eslint-disable-next-line no-undef
//   before((done) => {
//     return knex('options').del()
//       .then(() => {
//         done();
//       }).catch((err) => {
//         done(err);
//       });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Count amount of options', (done) => {
//     return Option.count().then((c) => {
//       assert.equal(c, 0);
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//   // eslint-disable-next-line no-undef
//   it('Get all options', (done) => {
//     return Option.all().then((options) => {
//       assert.equal(options.length, 0);
//       options.should.be.array; //eslint-disable-line
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//
//   // eslint-disable-next-line no-undef
//   it('Get the first date', (done) => {
//     return Option.getFirstDate().then((date) => {
//       date.should.be.date; //eslint-disable-line
//       done();
//     }).catch((err) => {
//       assert.equal('No se encontró una respuesta válida', err);
//       done();
//     });
//   });
//   // eslint-disable-next-line no-undef
//   it('Get the attributes', (done) => {
//     return Option.getAttributesNames().then((attr) => {
//       attr.should.be.array; // eslint-disable-line
//       assert.equal(attr.length, 6);
//       attr.should.contain('id');
//       attr.should.contain('created_at');
//       attr.should.contain('updated_at');
//       attr.should.contain('statement');
//       attr.should.contain('enumeration');
//       attr.should.contain('question_id');
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Get new empty option', (done) => {
//     return Option.new().then((option) => {
//       option.should.have.property('id');
//       option.should.have.property('created_at');
//       option.should.have.property('updated_at');
//       option.should.have.property('statement');
//       option.should.have.property('enumeration');
//       option.should.have.property('question_id');
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
// });
//
// // eslint-disable-next-line no-undef
// describe('Options: CUD of CRUD', () => {
//   // eslint-disable-next-line no-undef
//   before((done) => {
//     return knex.seed.run()
//       .then(() => {
//         done();
//       }).catch((err) => {
//         done(err);
//       });
//   });
//
//   // eslint-disable-next-line no-undef
//   it('Create new Option', (done) => {
//     const newOption = {
//       statement: 'meneh',
//       enumeration: 'c',
//     };
//     return Option.save(newOption).then((option) => {
//       option.should.have.property('id');
//       option.should.have.property('created_at');
//       assert.notEqual(option.created_at, null);
//       option.should.have.property('updated_at');
//       assert.notEqual(option.updated_at, null);
//       option.should.have.property('statement');
//       assert.equal(option.statement, newOption.statement);
//       option.should.have.property('enumeration');
//       assert.equal(option.enumeration, newOption.enumeration);
//       option.should.have.property('question_id');
//       assert.equal(option.question_id, null);
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });
  // // eslint-disable-next-line no-undef
  // it('Update option', (done) => {
  //   return Option.all().then((options) => {
  //     const i = Math.floor(Math.random() * options.length);
  //     const beforeUpdate = options[i];
  //     const updateAttr = {
  //       statement: 'new statement',
  //     };
  //     Option.update(beforeUpdate.id, updateAttr)
  //     .then((option) => {
  //       option.should.have.property('id');
  //       assert.equal(beforeUpdate.id, option.id);
  //       option.should.have.property('created_at');
  //       assert.equalDate(option.created_at, beforeUpdate.created_at);
  //       option.should.have.property('updated_at');
  //       assert.afterTime(option.updated_at, beforeUpdate.updated_at);
  //       option.should.have.property('statement');
  //       assert.equal(option.statement, updateAttr.statement);
  //       option.should.have.property('enumeration');
  //       assert.equal(option.enumeration, beforeUpdate.enumeration);
  //       option.should.have.property('question_id');
  //       assert.equal(option.question_id, beforeUpdate.question_id);
  //       done();
  //     })
  //     .catch((err) => {
  //       done(err);
  //     });
  //   }).catch((err) => {
  //     done(err);
  //   });
  // });
// });
