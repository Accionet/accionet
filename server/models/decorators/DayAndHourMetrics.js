// Table Date and Hour
const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');

function getGroupedByDayAndHour(searchParams) {
  return this.table()
    .select(knex.raw('EXTRACT(year FROM created_at) as year, EXTRACT(doy FROM created_at) as doy, EXTRACT (hour from created_at) as hour, count(*) as amount'))
    .where(searchParams)
    .groupByRaw('year, doy, hour')
    .orderByRaw('year, doy, hour');
}

function tableDateAndHour(searchParams) {
  return new Promise((resolve, reject) => {
    this.getGroupedByDayAndHour(searchParams).then((entries) => {
      const data = TimeAdapter.mapForDayAndHourGraph(entries);
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
}

exports.addDayAndHourTable = function (prototype) {
  prototype.tableDateAndHour = tableDateAndHour;
  prototype.getGroupedByDayAndHour = getGroupedByDayAndHour;
};
