exports.up = function (knex) {
  return knex.schema.table('surveys', (table) => {
    table.dropColumn('user_id');
  });
};

exports.down = function (knex) {
  return knex.schema.table('surveys', (table) => {
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
};
