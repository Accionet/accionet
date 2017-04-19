const Activatable = require('./activatable'); // eslint-disabled-this-line no-unused-vars
const Visits = require('./visits');

class Places extends Activatable {

  constructor() {
    const table_name = 'places';
    super(table_name);
  }

  metrics(id, offset) {
    return new Promise((resolve, reject) => {
      const visitPromises = [];
      const place = {
        place_id: id,
      };
      visitPromises.push(Visits.byDay(place, offset));
      visitPromises.push(Visits.byHour(place, offset));
      visitPromises.push(Visits.tableDateAndHour(place, offset));
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

  save(attr) {
    // its not defined
    if (!attr.is_active) {
      attr.is_active = false;
    }
    return super.save(attr);
  }
}

const instance = new Places();

module.exports = instance;
