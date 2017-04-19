// Amount By Day
const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');
const dbUtils = require('../../services/dbUtils');


function getGroupedByDay(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    dbUtils.getMinutesInterval(minUTCOffset).then((minOffset) => {
      resolve(this.table()
        .select(knex.raw(`EXTRACT(year from (created_at + INTERVAL '${minOffset} minutes')) as year, EXTRACT(DOY from (created_at + INTERVAL '${minOffset} minutes')) as doy, count(*) as amount`))
        .where(searchParams)
        .groupByRaw('year, doy')
        .orderByRaw('year, doy')
      );
    }).catch((err) => {
      reject(err);
    });
  });
}

function byDay(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    this.getGroupedByDay(searchParams, minUTCOffset).then((entries) => {
      const parsedEntries = TimeAdapter.mapForDailyGraph(entries);
      resolve(parsedEntries);
    }).catch((err) => {
      reject(err);
    });
  });
}


exports.addDayMetrics = function (prototype) {
  prototype.byDay = byDay;
  prototype.getGroupedByDay = getGroupedByDay;
};
