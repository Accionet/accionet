const Visit = require('../visits'); // eslint-disable-line no-unused-vars
const knex = require('../../db/knex');


class VisitMetric {

  constructor(place) {
    this.place = place;
  }


// Amount By Day

  byDay() {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(year from created_at) as year, EXTRACT(DOY from created_at) as doy, count(*) as amount'))
        .where({
          place_id: this.place.id,
        })
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
      parsedEntries.push([date, entry.amount]);
    }
    return parsedEntries;
  }


  dateFromDayAndYear(year, day) {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }


  // Amount By Hour
  byHour() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  // Table Date and Hour

  tableDateAndHour() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}


module.exports = VisitMetric;
