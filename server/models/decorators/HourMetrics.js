const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');
const dbUtils = require('../../services/dbUtils');


// minUTCOffset is the offset, in minutes from UTC-00
function getGroupedByHour(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    dbUtils.getMinutesInterval(minUTCOffset).then((minOffset) => {
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
