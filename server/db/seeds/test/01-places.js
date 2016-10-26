'use strict';
const places = require('./places/samples');
const visits = require('./visits/generate');


exports.seed = function (knex, Promise) {
  const placePromises = [];
  places.forEach((place) => {
    placePromises.push(createPlace(knex, place));
  });
  return Promise.all(placePromises);
};

function createPlace(knex, place) {
  return knex.table('places')
    .returning('*')
    .insert(place).then((place) => {
      return visits.generate(knex, place[0], {});
    });
}
