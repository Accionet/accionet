exports.up = function (knex) {
  return knex.schema.table('person', (table) => {
    table.string('macaddress');
  });
};

exports.down = function (knex) {
  return knex.schema.table('response', (table) => {
    table.dropColumn('macaddress');
  });
};
