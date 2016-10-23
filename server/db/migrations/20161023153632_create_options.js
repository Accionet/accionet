exports.up = function (knex) {
  return knex.schema.createTable('options', (table) => {
    // Incremental id
    table.increments();
    table.integer('question_id');
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.string('enumeration');
    table.text('statement').notNullable();
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('options');
};
