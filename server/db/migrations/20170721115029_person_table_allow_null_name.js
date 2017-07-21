
exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE person ALTER COLUMN name DROP NOT NULL');
};

exports.down = function () {

};
