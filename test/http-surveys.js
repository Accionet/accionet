process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const knex = require('../server/db/knex');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

// eslint-disable-next-line no-undef
describe('API Routes', () => {
  // eslint-disable-next-line no-undef
  // beforeEach((done) => {
  //   knex.migrate.rollback()
  //     .then(() => {
  //       knex.migrate.latest()
  //         .then(() => {
  //           return knex.seed.run()
  //             .then(() => {
  //               done();
  //             });
  //         });
  //     });
  // });
  // // eslint-disable-next-line no-undef
  // afterEach((done) => {
  //   knex.migrate.rollback()
  //     .then(() => {
  //       done();
  //     });
  // });
});

// eslint-disable-next-line no-undef
describe('Test: GET should be html and have status 200  ', () => {
  const baseUrl = '/surveys';
  // eslint-disable-next-line no-undef
  it('should check for GET surveys', (done) => {
    chai.request(server)
      .get(`${baseUrl}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html; // eslint-disable-line no-unused-expressions
        done();
      });
  });
  // eslint-disable-next-line no-undef
  it('should check for GET surveys/disabled', (done) => {
    chai.request(server)
      .get(`${baseUrl}/disabled`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html; // eslint-disable-line no-unused-expressions
        done();
      });
  });
  // eslint-disable-next-line no-undef
  it('should check for GET surveys/new', (done) => {
    chai.request(server)
      .get(`${baseUrl}/new`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html; // eslint-disable-line no-unused-expressions
        done();
      });
  });
});
