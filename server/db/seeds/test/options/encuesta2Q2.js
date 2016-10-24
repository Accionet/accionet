exports.seed = function (knex, question) {
  return knex('options').insert({
    question_id: question.id,
    statement: 'Si',
    enumeration: 'a',
  })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'No',
        enumeration: 'b',
      });
    })
    .then(() => {
      return knex('options').insert({
        question_id: question.id,
        statement: 'No lo se',
        enumeration: 'c',
      });
    });
};
