exports.seed = function (knex) {
  return knex('users').del() // Deletes ALL existing entries
    .then(() => ( // Inserts seed entries one by one in series
      knex('users').insert({
        username: 'accionet',
        password: 'accionet159',
        email: 'antonio@accionet.cl',
        is_admin: true,
        is_active: true,
      })
    ));
};
