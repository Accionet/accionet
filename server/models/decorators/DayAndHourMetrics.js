// Table Date and Hour
const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');
const dbUtils = require('../../services/dbUtils');


function getGroupedByDayAndHour(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    dbUtils.getMinutesInterval(minUTCOffset).then((minOffset) => {
      resolve(this.table()
        .select(knex.raw(`EXTRACT(year FROM (created_at + INTERVAL '${minOffset} minutes')) as year, EXTRACT(doy FROM (created_at + INTERVAL '${minOffset} minutes')) as doy, EXTRACT (hour from (created_at + INTERVAL '${minOffset} minutes')) as hour, count(*) as amount`))
        .where(searchParams)
        .groupByRaw('year, doy, hour')
        .orderByRaw('year, doy, hour')
      );
    }).catch((err) => {
      reject(err);
    });
  });
}

function tableDateAndHour(searchParams, minUTCOffset) {
  return new Promise((resolve, reject) => {
    this.getGroupedByDayAndHour(searchParams, minUTCOffset).then((entries) => {
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
