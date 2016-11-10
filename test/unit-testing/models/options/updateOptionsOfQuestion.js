process.env.NODE_ENV = 'test';

const chai = require('chai');
const dateChai = require('chai-datetime');
const knex = require('../../../../server/db/knex');
const Option = require('../../../../server/newModels/options');
const Question = require('../../../../server/newModels/questions');

// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(dateChai);

const NO_QUESTION = 'No se encontró una entrada con id = -8';
const INVALID_OPTION = 'La pregunta es inválida. Las opciones no están definidas correctamente';
const INVALID_QUESTION = 'La pregunta es inválida. No tiene el atributo id';

// eslint-disable-next-line no-undef
describe('Options: Malicious update options of question', () => {
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
  it('References to invalid question', (done) => {
    const question = {
      id: -8,
      options: [{
        statement: 'state',
        enumeration: 'a',
      }],
    };
    return Option.updateOptionsOfQuestion(question).then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(NO_QUESTION, err);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Empty options', (done) => {
    return Question.all().then((questions) => {
      const question = {
        id: questions[0].id,
        options: [],
      };
      Option.updateOptionsOfQuestion(question).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(INVALID_OPTION, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Dont pass options', (done) => {
    return Question.all().then((questions) => {
      const question = {
        id: questions[0].id,
      };
      Option.updateOptionsOfQuestion(question).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(INVALID_OPTION, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass as options something that is not an array', (done) => {
    return Question.all().then((questions) => {
      const question = {
        id: questions[0].id,
        options: 3,
      };
      Option.updateOptionsOfQuestion(question).then(() => {
        done('Error, it should return something valid');
      }).catch((err) => {
        assert.equal(INVALID_OPTION, err);
        done();
      }).catch((err) => {
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Delete questions, add new, and modify existing', (done) => {
    return Question.all().then((questions) => {
      const i = Math.floor(Math.random() * questions.length);

      const n = Math.floor(Math.random() * questions[i].options.length);
      let cut = 1;
      if (n > 2) {
        cut = 2;
      }
        // delete
      const question = {
        options: questions[i].options.slice().splice(cut),
        id: questions[i].id,
      };

        // modify
      question.options[0].statement = 'statement modified';


        // add new
      question.options.push({
        statement: 'new option',
        enumeration: 'z',
      });


      Option.updateOptionsOfQuestion(question).then((modifiedQuestion) => {
        assert.equal(modifiedQuestion.id, question.id);
        assert.equal(modifiedQuestion.options.length, question.options.length);
        let modifiedDone = false;
        let addedDone = false;
        for (let j = 0; j < modifiedQuestion.options.length; j++) {
            // register if the modified statement was register
          if (modifiedQuestion.options[j].statement === question.options[0].statement) {
            modifiedDone = true;
            assert.equal(modifiedQuestion.options[j].enumeration, question.options[0].enumeration);
          }
          if (modifiedQuestion.options[j].statement === 'new option') {
            addedDone = true;
          }
        }
        assert.equal(modifiedDone, true);
        assert.equal(addedDone, true);
        done();
      }).catch((err) => {
        // console.log(err);
        done(err);
      });
    }).catch((err) => {
      done(err);
    });
  });

  // eslint-disable-next-line no-undef
  it('Pass not an object as a parameter', (done) => {
    return Option.updateOptionsOfQuestion('question').then(() => {
      done('Error, it should return something valid');
    }).catch((err) => {
      assert.equal(INVALID_QUESTION, err);
      done();
    }).catch((err) => {
      done(err);
    })
      .catch((err) => {
        done(err);
      });
  });
});
