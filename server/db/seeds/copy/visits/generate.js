exports.generate = function (knex, Promise, place, hotspot) {
  const macaddress = Math.random().toString(8).substring(2, 4);
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));
  return knex('visits').insert({
    place_id: place.id,
    hotspot_id: hotspot.id,
    macaddress,
    created_at: date,
  });
};
