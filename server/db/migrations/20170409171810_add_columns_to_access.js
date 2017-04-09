
exports.up = function (knex) {
  return knex.schema.table('access', (table) => {
    table.dropColumn('place_id');
    table.integer('access_id');
    table.string('table_name');
  });
};

exports.down = function (knex) {
  return knex.schema.table('access', (table) => {
    table.integer('place_id');
    table.foreign('place_id').references('places.id');
    table.dropColumn('access_id');
    table.dropColumn('table_name');
  });
};
