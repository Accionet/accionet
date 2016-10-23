exports.up = function (knex) {
  return knex.schema.createTable('access', (table) => {
    // Incremental id
    table.increments();
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.integer('place_id');
    table.foreign('place_id').references('places.id');
    table.string('access_type');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('access');
};
