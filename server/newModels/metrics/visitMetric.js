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
  byHour() {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(hour from created_at) as hour, count(*) as amount'))
        .where({
          place_id: this.place.id,
        })
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

  // exports.amountByHour = function (attr, callback) {
  //   let results = [];
  //     // "SELECT EXTRACT(HOUR from created_at) AS hour, count(*) AS amount FROM visits GROUP BY hour ORDER BY hour"
  //
  //   pg.connect(connectionString, (err, client, done) => {
  //         // Handle connection errors
  //     if (err) {
  //       done();
  //       return callback(err);
  //     }
  //
  //
  //     const params = base.parseJsonToParams(attr);
  //     let string_query = `SELECT EXTRACT(HOUR from created_at) AS hour, count(*) AS amount FROM ${table_name} `;
  //     string_query += base.getWhereFromParams(params, true);
  //     string_query += ' GROUP BY hour ORDER BY hour ';
  //
  //     const query = client.query(string_query, params.values);
  //
  //         // SQL Query > Select Data
  //
  //     results = [];
  //
  //     query.on('error', (err) => (callback(err)));
  //
  //         // Stream results back one row at a time
  //     query.on('row', (row) => {
  //       results.push([new Date(null, null, null, row.hour).getTime(), row.amount]);
  //     });
  //
  //         // After all data is returned, close connection and return results
  //     query.on('end', () => {
  //       done();
  //             // fill with missing hours
  //       for (let h = 0; h < 24; h++) {
  //         let present = false;
  //         for (let i = 0; i < results.length; i++) {
  //           if (new Date(results[i][0]).getHours() === h) {
  //             present = true;
  //             break;
  //           }
  //         }
  //         if (!present) {
  //           results.push([new Date(null, null, null, h).getTime(), 0]);
  //         }
  //       }
  //       results.sort((a, b) => (a[0] - b[0]));
  //       return callback(null, results);
  //     });
  //   });
  // };

  // Table Date and Hour

  tableDateAndHour() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}


module.exports = VisitMetric;
