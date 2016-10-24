const rangoEtario = require('./surveys/rangoEtario');
const encuesta1 = require('./surveys/encuesta1');
const encuesta2 = require('./surveys/encuesta2');


exports.seed = function (knex) {
  return knex('users').insert({
    username: 'accionet',
    password: 'accionet159',
    email: 'antonio@accionet.cl',
    is_admin: true,
    is_active: true,
  }).returning('*')
    .then((user) => {
      return rangoEtario.seed(knex, user[0])
        .then(() => {
          return encuesta1.seed(knex, user[0]);
        })
        .then(() => {
          return encuesta2.seed(knex, user[0]);
        });
    });
};
