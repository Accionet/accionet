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


const defaultErrorMessage = 'Something went wrong';

const nonExistantAttibute = 'Parameter contains invalid attributes';
const unvalidJSON = 'Parameter should be a valid json';
const emptyJSON = 'Paremeter should not be empty';
const notFoundMessage = 'No se encontró una entrada con id = ';
const differentIDs = 'Given IDs differ';


// eslint-disable-next-line no-undef
describe('Options: Malicious Save', () => {
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is not a json', (done) => {
    return Option.save(3).then(() => {
      done('Error, it should not return something valid');
    }).catch((err) => {
      assert.equal(unvalidJSON, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save empty json', (done) => {
    return Option.save({}).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(emptyJSON, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save json that only contains not setable attribute. Should complain as its an emptyJSON', (done) => {
    return Option.save({
      created_at: new Date(),
      updated_at: new Date(),
      id: 3,
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(emptyJSON, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save with non-existant attribute', (done) => {
    return Option.save({
      statement: 'hola',
      somethingDoestExist: 3,
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(nonExistantAttibute, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Save attribute does not map with type', (done) => {
    return Option.save({
      question_id: 'as3',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Check that updated_at, created_at and id cannot be fixed', (done) => {
    const created_at = new Date(2000, 10, 5);
    const updated_at = new Date(2000, 10, 6);
    const id = -8;
    const statement = 'statement';
    const enumeration = 'c';


    return Option.save({
      created_at,
      updated_at,
      id,
      statement,
      enumeration,
    }).then((option) => {
      option.should.have.property('id');
      option.should.have.property('created_at');
      assert.afterTime(option.created_at, created_at);
      option.should.have.property('updated_at');
      assert.afterTime(option.updated_at, updated_at);
      option.should.have.property('statement');
      assert.equal(option.statement, statement);
      option.should.have.property('enumeration');
      assert.equal(option.enumeration, enumeration);
      option.should.have.property('question_id');
      assert.equal(option.question_id, null);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('References to invalid question', (done) => {
    return Option.save({
      question_id: -3,
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('null value in column "statement" violates not-null constraint', (done) => {
    return Option.save({
      statement: null,
      enumeration: 'a',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  // eslint-disable-next-line no-undef
  it('value of enumeration too long for type character varying(255)', (done) => {
    return Option.save({
      enumeration: '......veryLongStringOfMoreThan255Characters............veryLongStringOfMoreThan255Characters............veryLongStringOfMoreThan255Characters............veryLongStringOfMoreThan255Characters............veryLongStringOfMoreThan255Characters............veryLongStringOfMoreThan255Characters......',
      statement: 'state',
    }).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(defaultErrorMessage, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});

// eslint-disable-next-line no-undef
describe('Options: Malicious update', () => {
  // eslint-disable-next-line no-undef
  it('Update unexistant option', (done) => {
    const id = -80;
    return Option.update(id, {
      enumeration: 'a',
    }).then(() => {
      done('Error, it should not return something valid');
    }).catch((err) => {
      assert.equal(notFoundMessage + id, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter something that is not a json', (done) => {
    return Option.all().then((options) => {
      const id = options[0].id;
      return Option.update(id, 'not a json').then(() => {
        done('Error, it should not return something valid');
      }).catch((err) => {
        assert.equal(unvalidJSON, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter not updatable attributes', (done) => {
    return Option.all().then((options) => {
      const id = options[0].id;
      return Option.update(id, {
        created_at: new Date(),
        updated_at: new Date(),
        id,
      }).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(emptyJSON, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as parameter with unmatching ids', (done) => {
    return Option.all().then((options) => {
      const id = options[0].id;
      return Option.update(id, {
        created_at: new Date(),
        updated_at: new Date(),
        id: (id - 1),
      }).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(differentIDs, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Update unexistant parameter', (done) => {
    return Option.all().then((options) => {
      const id = options[0].id;
      return Option.update(id, {
        statement: 'hola',
        somethingDoestExist: 3,
      }).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(nonExistantAttibute, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Update column with different data type', (done) => {
    return Option.all().then((options) => {
      const id = options[0].id;
      return Option.update(id, {
        question_id: 'not an integer',
      }).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(defaultErrorMessage, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Make sure not to change un-updatable columns', (done) => {
    const created_at = new Date(2000, 10, 5);
    const updated_at = new Date(2000, 10, 6);
    const statement = 'statement';
    const enumeration = 'xx';
    return Option.all().then((options) => {
      const beforeUpdate = options[0];
      return Option.update(beforeUpdate.id, {
        created_at,
        updated_at,
        statement,
        enumeration,
      }).then((option) => {
        option.should.have.property('id');
        assert.equal(option.id, beforeUpdate.id);
        option.should.have.property('created_at');
        if (beforeUpdate.created_at) {
          assert.equalTime(option.created_at, beforeUpdate.created_at);
        } else {
          assert.equal(option.created_at, beforeUpdate.created_at);
        }
        option.should.have.property('updated_at');
        assert.afterTime(option.updated_at, updated_at);
        option.should.have.property('statement');
        assert.equal(option.statement, statement);
        option.should.have.property('enumeration');
        assert.equal(option.enumeration, enumeration);
        option.should.have.property('question_id');
        assert.equal(option.question_id, beforeUpdate.question_id);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });
});
