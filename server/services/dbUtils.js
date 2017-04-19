const knex = require('../db/knex');


function getMinutesInterval(inputParam) {
  return new Promise((resolve, reject) => {
    const minutes_offset = parseInt(inputParam, 10);
    if (isNaN(minutes_offset)) {
      return resolve(0);
    }
    getOffset().then((result) => {
      console.log('Desfaz bd ' + (result.rows[0].sec_offset / 60));
      resolve(minutes_offset - (result.rows[0].sec_offset / 60));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOffset() {
  return knex.raw('SELECT EXTRACT(TIMEZONE from now()) as sec_offset');
}


exports.getOffset = getOffset;

exports.getMinutesInterval = getMinutesInterval;
