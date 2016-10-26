exports.seed = function (knex, question) {
  return knex('options').insert({
    question_id: question.id,
    statement: 'Uno',
    enumeration: 'a',
  })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Dos',
        enumeration: 'b',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Tres',
        enumeration: 'c',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'Cuatro',
        enumeration: 'd',
      });
    });
};
