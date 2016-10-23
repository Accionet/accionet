exports.up = function (knex) {
  return knex.schema.createTable('places', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.text('description');
    table.string('email');
    table.integer('phone_number');
    table.integer('daily_visits');
    table.integer('status').defaultTo(0);
    table.boolean('is_active').defaultTo(false);
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('places');
};
