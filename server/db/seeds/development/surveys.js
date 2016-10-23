exports.seed = function (knex) {
  return knex('surveys').del() // Deletes ALL existing entries
    .then(() => { // Inserts seed entries one by one in series
      knex('users').select().first().then((user) => {
        console.log(user.id);
        console.log(user.name);
      });
    });
};
