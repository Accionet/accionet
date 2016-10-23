exports.up = function (knex) {
  return knex.schema.createTable('questions', (table) => {
    // Incremental id
    table.increments();
    table.integer('survey_id');
    table.foreign('survey_id').references('id').inTable('surveys').onDelete('CASCADE');
    table.text('title').notNullable();
    table.string('type').notNullable();
    table.integer('number');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('questions');
};
