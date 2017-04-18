exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    table.string('location_address');
  });
};

exports.down = function (knex) {
  return knex.schema.table('access', (table) => {
    table.dropColumn('location_address');
  });
};
