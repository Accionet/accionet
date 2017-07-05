exports.up = function (knex) {
  return knex.schema.table('hotspots', (table) => {
    table.integer('place_id');
    table.foreign('place_id').references('places.id').onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.table('hotspots', (table) => {
    // Incremental id
    table.dropColumn('place_id');
  });
};
