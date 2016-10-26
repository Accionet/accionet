const visits = require('./visits/generate');
const places = require('./places/samples');

exports.seed = function (knex, Promise) {
  const placePromises = [];
  places.forEach((place) => {
    placePromises.push(createPlace(knex, Promise, place));
  });
  Promise.all(placePromises);
};

function createPlace(knex, Promise, place) {
  return knex('places').insert(place).returning('*')
    .then((place) => {
      visits.generate(knex, Promise, place[0], {});
    });
}
