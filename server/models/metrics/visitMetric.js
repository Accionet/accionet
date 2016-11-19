const Visit = require('../visits'); // eslint-disable-line no-unused-vars
const knex = require('../../db/knex');


class VisitMetric {


  // Amount By Day

  byDay(searchParams) {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(year from created_at) as year, EXTRACT(DOY from created_at) as doy, count(*) as amount'))
        .where(searchParams)
        .groupByRaw('year, doy')
        .orderByRaw('year, doy')
        .then((entries) => {
          const parsedEntries = this.parseDateOf(entries);
          resolve(parsedEntries);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  parseDateOf(entries) {
    const parsedEntries = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const date = this.dateFromDayAndYear(entry.year, entry.doy);
      parsedEntries.push([date.getTime(), entry.amount]);
    }
    return parsedEntries;
  }


  dateFromDayAndYear(year, day) {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }


  parseHourOf(entries) {
    const parsedEntries = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const time = new Date(null, null, null, entry.hour).getTime();
      parsedEntries.push([time, entry.amount]);
    }
    return parsedEntries;
  }

  hourPresentIn(hour, array) {
    for (let i = 0; i < array.length; i++) {
      if (new Date(array[i][0]).getHours() === hour) {
        return true;
      }
    }
    return false;
  }

  fillMissingHours(array) {
    for (let h = 0; h < 24; h++) {
      if (!this.hourPresentIn(h, array)) {
        array.push([new Date(null, null, null, h).getTime(), 0]);
      }
    }
    array.sort((a, b) => {
      return a[0] - b[0];
    });
  }

  // Amount By Hour
  byHour(searchParams) {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(hour from created_at) as hour, count(*) as amount'))
        .where(searchParams)
        .groupBy('hour')
        .orderBy('hour')
        .then((entries) => {
          const parsedEntries = this.parseHourOf(entries);
          this.fillMissingHours(parsedEntries);
          resolve(parsedEntries);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  addDateTo(results, row) {
    const date = this.dateFromDayAndYear(row.year, row.doy).toString().substring(0, 15);
    if (!results[date]) {
      results[date] = [];
    }
    results[date].push(row);
  }

  parseDateAndHourOf(entries) {
    const data = [];
    const json = {};
    for (let i = 0; i < entries.length; i++) {
      this.addDateTo(json, entries[i]);
    }
    for (let i = 0; i < Object.keys(json).length; i++) {
      const date = Object.keys(json)[i];
      const dataFromDate = this.parseHourOf(json[date]);
      this.fillMissingHours(dataFromDate);
      data.push({
        label: date,
        data: dataFromDate,
      });
    }
    return data;
  }

  // Table Date and Hour

  tableDateAndHour(searchParams) {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(year FROM created_at) as year, EXTRACT(doy FROM created_at) as doy, EXTRACT (hour from created_at) as hour, count(*) as amount'))
        .where(searchParams)
        .groupByRaw('year, doy, hour')
        .orderByRaw('year, doy, hour')
        .then((entries) => {
          const data = this.parseDateAndHourOf(entries);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


}
const instance = new VisitMetric();
module.exports = instance;
