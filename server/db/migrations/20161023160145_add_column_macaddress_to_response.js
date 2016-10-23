exports.up = function (knex) {
  return knex.schema.table('response', (table) => {
    // Incremental id
    table.string('macaddress');
  });
};

exports.down = function (knex) {
  return knex.schema.table('response', (table) => {
    // Incremental id
    table.dropColumn('macaddress');
  });
};
