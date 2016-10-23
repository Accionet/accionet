exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE places ALTER COLUMN phone_number TYPE VARCHAR(20)');
};

exports.down = function (knex, promise) {
  return promise;
  // return knex.schema.raw('ALTER TABLE places ALTER COLUMN phone_number TYPE INTEGER');
};
