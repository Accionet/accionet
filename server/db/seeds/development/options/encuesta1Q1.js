exports.seed = function (knex, question) {
  return knex('options').insert({
    question_id: question.id,
    statement: '10 años o menor',
    enumeration: 'a',
  })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Entre 10 y 15 años',
        enumeration: 'b',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'entre 16 y 20 años',
        enumeration: 'c',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'entre 21 y 25 años',
        enumeration: 'd',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'entre 26 y 30 años',
        enumeration: 'e',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'entre 31 y 40 años',
        enumeration: 'f',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'más de 40 años',
        enumeration: 'g',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Ya he respondido esta pregunta',
        enumeration: 'h',
      });
    });
};
