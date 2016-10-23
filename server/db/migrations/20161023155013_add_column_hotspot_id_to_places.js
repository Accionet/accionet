exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    // Incremental id
    table.integer('hotspot_id');
    table.foreign('hotspot_id').references('id').inTable('hotspots').onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.table('places', (table) => {
    // Incremental id
    table.dropColumn('hotspot_id');
  });
};
