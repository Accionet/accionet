exports.up = function (knex) {
  return knex.schema.createTable('person', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.string('phone_number');
    table.string('email');
    table.json('facebook');
    table.integer('gender');
    table.date('birthday');
    table.text('nationality');
    table.text('current_city');
    table.text('current_municipality');
    table.text('current_address');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('person');
};
