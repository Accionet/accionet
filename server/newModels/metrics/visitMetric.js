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

  addDateTo(results, row) {
    console.log(row.year);
    const date = this.dateFromDayAndYear(row.year, row.doy).toString().substring(0, 15);
    if (!results[date]) {
      results[date] = new Array(24);
    }

    results[date][row.hour] = row.amount;
  }

  parseDateAndHourOf(entries) {
    const data = [];
    const json = {};
    for (let i = 0; i < entries.length; i++) {
      this.addDateTo(json, entries[i]);
    }
    for (let i = 0; i < Object.keys(json).length; i++) {
      const date = Object.keys(json)[i];
      const dataFromDate = [];
      // fill missing hours
      for (let j = 0; j < 24; j++) {
        const hours = new Date(null, null, null, j).getTime();
        let amount;
        if (json[date][j]) {
          amount = json[date][j];
        } else {
          amount = 0;
        }
        dataFromDate.push([hours, amount]);
      }
      data.push({
        label: date,
        data: dataFromDate,
      });
    }
    return data;
  }

  // Table Date and Hour

  tableDateAndHour() {
    return new Promise((resolve, reject) => {
      Visit.table()
        .select(knex.raw('EXTRACT(year FROM created_at) as year, EXTRACT(doy FROM created_at) as doy, EXTRACT (hour from created_at) as hour, count(*) as amount'))
        .where({
          place_id: this.place.id,
        })
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

  // exports.tableDateAndHour = function (attr, callback) {
  //   const results = {};
  //   const data = [];
  //   pg.connect(connectionString, (err, client, done) => {
  //         // Handle connection errors
  //     if (err) {
  //       done();
  //       return callback(err);
  //     }
  //
  //         // SQL Query > Delete Data
  //     const params = base.parseJsonToParams(attr);
  //     let string_query = `SELECT EXTRACT(doy FROM created_at) as doy, EXTRACT(hour FROM created_at) as hour, count(*) as amount FROM ${table_name} `;
  //     string_query += base.getWhereFromParams(params, true);
  //     string_query += '  GROUP BY doy, hour ORDER BY doy,hour ';
  //     const query = client.query(string_query, params.values);
  //
  //
  //     query.on('error', (err) => (callback(err)));
  //
  //         // Stream results back one row at a time
  //     query.on('row', (row) => {
  //       const date = dateFromDay(2016, row.doy).toString().substring(0, 15);
  //       if (!results[date]) {
  //         results[date] = new Array(24);
  //       }
  //
  //       results[date][row.hour] = row.amount;
  //     });
  //
  //         // After all data is returned, close connection and return results
  //     query.on('end', () => {
  //       done();
  //       for (let i = 0; i < Object.keys(results).length; i++) {
  //         const date = Object.keys(results)[i];
  //         const dataFromDate = [];
  //         for (let j = 0; j < 24; j++) {
  //           const hours = new Date(null, null, null, j).getTime();
  //           let amount;
  //           if (results[Object.keys(results)[i]][j]) {
  //             amount = results[Object.keys(results)[i]][j];
  //                         // dataFromDate.push([new Date(null, null, null, h).getTime(), results[Object.keys(results)[i]][j]);
  //           } else {
  //             amount = 0;
  //           }
  //           dataFromDate.push([hours, amount]);
  //         }
  //         data.push({
  //           label: date,
  //           data: dataFromDate,
  //         });
  //       }
  //       return callback(null, data);
  //     });
  //   });
  // };

}


module.exports = VisitMetric;
