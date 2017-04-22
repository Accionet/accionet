const requestify = require('requestify');

const domain = 'http://localhost:3000';
const path = '/visits/new';
const place_id = 35;

function createNewVisit() {
  return {
    macAddress: new Date(),
    place_id,
  };
}
