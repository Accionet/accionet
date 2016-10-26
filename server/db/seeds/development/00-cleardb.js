exports.seed = function (knex) {
  return knex('places').del() // Deletes ALL existing entries
    .then(() => { // Inserts seed entries one by one in series
      return knex('users').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('surveys').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('questions').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('options').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('response').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('answer').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('access').del();
    })
    .then(() => { // Inserts seed entries one by one in series
      return knex('visits').del();
    });
};
