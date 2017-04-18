const API_KEY = 'AIzaSyANbo-z7gB5Ag8R9usIVYdm2qhx20OHN3o';
const DEFAULT_LOCATION = '-33.4876785,-70.78158'; // corresponds to Santiago, Chile
const requestify = require('requestify');
const Place = require('../models/places');


function setOffsetOf(place) {
  let locationChanged = false;
  // if it got no location registered, register default location
  if (!place.location) {
    locationChanged = true;
    place.location = DEFAULT_LOCATION;
  }
  getOffset(place.location).then((minutes_offset) => {
    if (locationChanged || minutes_offset !== place.minutes_offset) {
      Place.update(place.id, {
        location: place.location,
        minutes_offset,
      });
    }
  }).catch((err) => {
    console.log(err); // eslint-disable-line
  });
}

function getOffset(location_string) {
  const route = `https://maps.googleapis.com/maps/api/timezone/json?location=${location_string}&timestamp=0000000000&key=${API_KEY}`;
  return new Promise((resolve, reject) => {
    requestify.get(route).then((results) => {
      const body = JSON.parse(results.body);
      const rawOffset = parseInt(body.rawOffset, 10) / 60;
      const dstOffset = parseInt(body.dstOffset, 10) / 60;
      const minutes_offset = dstOffset + rawOffset;
      resolve(minutes_offset);
    }).catch((err) => {
      reject(err);
    });
  });
}

exports.getMinutesOffset = getOffset;


function updateOffset() {
  console.log('----------------------UPDATING OFFSET---------------------------');
  Place.all().then((places) => {
    for (let i = 0; i < places.length; i++) {
      setOffsetOf(places[i]);
    }
  });
}


exports.updateOffset = updateOffset;
