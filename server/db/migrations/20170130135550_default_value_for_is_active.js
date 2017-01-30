
exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE users ALTER COLUMN is_active SET DEFAULT false');
};

exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE users ALTER COLUMN is_active DROP DEFAULT');
};
