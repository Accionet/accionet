exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    // Incremental id
    table.text('contact_name');
  });
};

exports.down = function (knex) {
  return knex.schema.table('places', (table) => {
    // Incremental id
    table.dropColumn('contact_name');
  });
};
