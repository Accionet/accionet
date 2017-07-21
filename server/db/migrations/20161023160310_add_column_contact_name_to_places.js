exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    table.text('contact_name');
  });
};

exports.down = function (knex) {
  return knex.schema.table('places', (table) => {
    table.dropColumn('contact_name');
  });
};
