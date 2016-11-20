const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars
const VisitMetric = require('./metrics/visitMetric');

class Places extends Activatable {

  constructor() {
    const table_name = 'places';
    super(table_name);
  }

  metrics(id) {
    return new Promise((resolve, reject) => {
      const visitPromises = [];
      const place = {
        place_id: id,
      };
      visitPromises.push(VisitMetric.byDay(place));
      visitPromises.push(VisitMetric.byHour(place));
      visitPromises.push(VisitMetric.tableDateAndHour(place));
      const allPromises = Promise.all(visitPromises);

      allPromises.then((response) => {
        const metrics = {
          daily: response[0],
          hourly: response[1],
          table: response[2],
        };
        resolve(metrics);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new Places();

module.exports = instance;
