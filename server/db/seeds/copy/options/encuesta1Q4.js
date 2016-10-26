exports.seed = function (knex, question) {
  return knex('options').insert({
    question_id: question.id,
    statement: 'Antonio',
    enumeration: 'a',
  })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Carlos',
        enumeration: 'b',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Ismael',
        enumeration: 'c',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Fuadsito',
        enumeration: 'd',
      });
    });
};
