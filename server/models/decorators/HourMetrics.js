const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');


function getGroupedByHour(searchParams) {
  return this.table()
    .select(knex.raw('EXTRACT(hour from created_at) as hour, count(*) as amount'))
    .where(searchParams)
    .groupBy('hour')
    .orderBy('hour');
}

function byHour(searchParams) {
  return new Promise((resolve, reject) => {
    this.getGroupedByHour(searchParams).then((entries) => {
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
