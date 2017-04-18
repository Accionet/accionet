
const API_KEY = 'AIzaSyANbo-z7gB5Ag8R9usIVYdm2qhx20OHN3o';
const requestify = require('requestify');

exports.getMinutesOffset = function (location_string) {
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
};
