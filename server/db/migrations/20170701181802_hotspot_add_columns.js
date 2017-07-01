exports.up = function (knex) {
  return knex.schema.table('hotspots', (table) => {
    // Incremental id
    table.string('url');
  });
};

exports.down = function (knex) {
  return knex.schema.table('hotspots', (table) => {
    // Incremental id
    table.dropColumn('url');
  });
};
