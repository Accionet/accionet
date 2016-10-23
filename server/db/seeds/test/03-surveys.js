exports.seed = function (knex) {
  return knex('surveys').del() // Deletes ALL existing entries
    .then(() => ( // Inserts seed entries one by one in series
        knex('users').select('*').where({
          username: 'accionet',
        }))
      .then((user) => (
        knex('surveys').insert({
          user_id: user.id,
          title: 'Rango Etario Streetpark',
          is_active: true,
        })
        .then(() => (
          knex('surveys').insert({
            user_id: user.id,
            title: 'Encuesta 1',
            is_active: true,
          })
        ))
        .then(() => (
          knex('surveys').insert({
            user_id: user.id,
            title: 'Encuesta 2',
            is_active: true,
          })
        ))
        .then(() => (
          knex('surveys').insert({
            user_id: user.id,
            title: 'Encuesta 3',
            is_active: true,
          })
        ))
      )));
};
