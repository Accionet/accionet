// Amount By Day
const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');

function getGroupedByDay(searchParams) {
  return this.table()
    .select(knex.raw('EXTRACT(year from created_at) as year, EXTRACT(DOY from created_at) as doy, count(*) as amount'))
    .where(searchParams)
    .groupByRaw('year, doy')
    .orderByRaw('year, doy');
}

function byDay(searchParams) {
  return new Promise((resolve, reject) => {
    this.getGroupedByDay(searchParams).then((entries) => {
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
