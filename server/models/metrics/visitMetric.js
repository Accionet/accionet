const Visit = require('../visits');
const TimeMetric = require('./timeMetric');


class VisitMetric extends TimeMetric {

  constructor() {
    super(Visit);
  }

}
const instance = new VisitMetric();
module.exports = instance;
