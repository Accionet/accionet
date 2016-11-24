const knex = require('../../db/knex');
const TimeAdapter = require('../../adapters/timeAdapter');


class TimeMetric {


  constructor(Table) {
    this.Table = Table;
  }

  // Amount By Day
  getGroupedByDay(searchParams) {
    return this.Table.table()
      .select(knex.raw('EXTRACT(year from created_at) as year, EXTRACT(DOY from created_at) as doy, count(*) as amount'))
      .where(searchParams)
      .groupByRaw('year, doy')
      .orderByRaw('year, doy');
  }

  byDay(searchParams) {
    return new Promise((resolve, reject) => {
      this.getGroupedByDay(searchParams).then((entries) => {
        const parsedEntries = TimeAdapter.mapForDailyGraph(entries);
        resolve(parsedEntries);
      }).catch((err) => {
        reject(err);
      });
    });
  }


  // Amount By Hour

  getGroupedByHour(searchParams) {
    return this.Table.table()
      .select(knex.raw('EXTRACT(hour from created_at) as hour, count(*) as amount'))
      .where(searchParams)
      .groupBy('hour')
      .orderBy('hour');
  }

  byHour(searchParams) {
    return new Promise((resolve, reject) => {
      this.getGroupedByHour(searchParams).then((entries) => {
        const parsedEntries = TimeAdapter.mapForHourlyGraph(entries);
        resolve(parsedEntries);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // Table Date and Hour

  getGroupedByDayAndHour(searchParams) {
    return this.Table.table()
      .select(knex.raw('EXTRACT(year FROM created_at) as year, EXTRACT(doy FROM created_at) as doy, EXTRACT (hour from created_at) as hour, count(*) as amount'))
      .where(searchParams)
      .groupByRaw('year, doy, hour')
      .orderByRaw('year, doy, hour');
  }

  tableDateAndHour(searchParams) {
    return new Promise((resolve, reject) => {
      this.getGroupedByDayAndHour(searchParams).then((entries) => {
        const data = TimeAdapter.mapForDayAndHourGraph(entries);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}


module.exports = TimeMetric;
