
exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    table.integer('minutes_offset');
    table.string('location');
  });
};

exports.down = function (knex) {
  return knex.schema.table('access', (table) => {
    table.dropColumn('minutes_offset');
    table.dropColumn('location');
  });
};
