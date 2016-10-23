exports.up = function (knex) {
  return knex.schema.createTable('visits', (table) => {
    // Incremental id
    table.increments();
    table.string('os');
    table.string('browser');
    table.string('ip');
    table.string('macaddress');
    table.text('other');

    table.integer('place_id');
    table.foreign('place_id').references('id').inTable('places').onDelete('SET NULL');

    table.integer('hotspot_id');
    table.foreign('hotspot_id').references('id').inTable('hotspots').onDelete('SET NULL');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('visits');
};
