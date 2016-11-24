const Visit = require('../visits');
const knex = require('../../db/knex');
const ByDayMetrics = require('./byDayMetrics');
const ByHourMetrics = require('./byHourMetrics');


class VisitMetric {


  // Amount By Day

  byDay(searchParams) {
    return ByDayMetrics.forGraph(searchParams, Visit);
  }


  // Amount By Hour
  byHour(searchParams) {
    return ByHourMetrics.forGraph(searchParams, Visit);
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
      const dataFromDate = ByHourMetrics.parseHourOf(json[date]);
      ByHourMetrics.fillMissingHours(dataFromDate);
      data.push({
        label: date,
        data: dataFromDate,
      });
    }
    return data;
  }

  dateFromDayAndYear(year, day) {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }

  // End users

  countEndUsers(searchParams) {
    return new Promise((resolve, reject) => {
      return knex.count('*').from(function () {
        this.distinct('macaddress').select().from(Visit.toString()).where(searchParams)
        .as('t1');
      }).as('ignored_alias').then((response) => {
        const amount = parseInt(response[0].count, 10);
        resolve(amount);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }


}
const instance = new VisitMetric();
module.exports = instance;
