exports.generate = function (knex, place, hotspot) {
  const promises = [];
  for (let i = 0; i < 500; i++) {
    const q1 = createVisit(knex, place, hotspot);
    promises.push(q1);
  }

  return Promise.all(promises);
};

function createVisit(knex, place, hotspot) {
  const macaddress = Math.random().toString(8).substring(2, 4);
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));

  return knex.table('visits').insert({
    place_id: place.id,
    hotspot_id: hotspot.id,
    macaddress,
    created_at: date,
  });
}
