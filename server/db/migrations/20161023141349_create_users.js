exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    // Incremental id
    table.increments();
    table.string('username').notNullable().unique();
    table.string('name');
    table.text('description');
    table.string('email').notNullable();
    table.text('password').notNullable();
    table.integer('type');
    table.boolean('is_active');
    table.boolean('is_admin');
    table.boolean('email_verified').notNullable().defaultTo(false);
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
