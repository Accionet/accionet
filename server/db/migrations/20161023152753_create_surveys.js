exports.up = function (knex) {
  return knex.schema.createTable('surveys', (table) => {
    // Incremental id
    table.increments();
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.boolean('is_active').defaultTo(false);
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('surveys');
};
