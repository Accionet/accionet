const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');


function getMinutesInterval(inputParam) {
  return new Promise((resolve, reject) => {
    const minutes_offset = parseInt(inputParam, 10);
    if (minutes_offset < 0 || isNaN(minutes_offset)) {
      return resolve(0);
    }
    knex.raw('SELECT EXTRACT(TIMEZONE from now()) as sec_offset').then((result) => {
      resolve(minutes_offset - (result.rows[0].sec_offset / 60));
    }).catch((err) => {
      reject(err);
    });
  });
}

// minUTCOffset is the offset, in minutes from UTC-00
function getGroupedByHour(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    getMinutesInterval(minUTCOffset).then((minOffset) => {
      resolve(this.table()
        .select(knex.raw(`EXTRACT(hour from (created_at + INTERVAL '${minOffset} minutes')) as hour, count(*) as amount`))
        .where(searchParams)
        .groupBy('hour')
        .orderBy('hour'));
    }).catch((err) => {
      reject(err);
    });
  });
}

function byHour(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    this.getGroupedByHour(searchParams, minUTCOffset).then((entries) => {
      const parsedEntries = TimeAdapter.mapForHourlyGraph(entries);
      resolve(parsedEntries);
    }).catch((err) => {
      reject(err);
    });
  });
}

exports.addHourMetrics = function (prototype) {
  prototype.byHour = byHour;
  prototype.getGroupedByHour = getGroupedByHour;
};
