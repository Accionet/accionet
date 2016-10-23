exports.up = function (knex) {
  return knex.schema.createTable('answer', (table) => {
    // Incremental id
    table.increments();
    table.integer('response_id');
    table.foreign('response_id').references('id').inTable('response').onDelete('SET NULL');
    table.integer('question_id');
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.integer('answer_option_id');
    table.foreign('answer_option_id').references('id').inTable('options').onDelete('CASCADE');
    table.text('answer_text');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('answer');
};
