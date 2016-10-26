
'use strict';
const users = require('./users/samples');
const surveys = require('./surveys/generate');

exports.seed = function (knex, Promise) {
  const userPromises = [];
  users.forEach((user) => {
    userPromises.push(createUser(knex, user));
  });
  return Promise.all(userPromises);
};

function createUser(knex, user) {
  return knex.table('users')
    .returning('*')
    .insert(user).then((user) => {
      return surveys.seed(knex, user[0]);
    });
}
