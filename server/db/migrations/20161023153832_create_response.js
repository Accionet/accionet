exports.up = function (knex) {
  return knex.schema.createTable('response', (table) => {
    // Incremental id
    table.increments();
    table.integer('survey_id');
    table.foreign('survey_id').references('id').inTable('surveys').onDelete('SET NULL');
    table.boolean('is_active').defaultTo(false);
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('response');
};
