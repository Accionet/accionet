// options/generate.js


exports.seed = function (knex, question, options) {
  const promises = [];
  options.forEach((option) => {
    option.question_id = question.id;
    const q1 = createOption(knex, option);
    promises.push(q1);
  });
  return Promise.all(promises);
};


function createOption(knex, option) {
  return knex.table('options').insert(option);
}
