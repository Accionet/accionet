const Response = require('../responses');
const TimeMetric = require('./timeMetric');


class ResponseMetric extends TimeMetric {

  constructor() {
    super(Response);
  }

}
const instance = new ResponseMetric();
module.exports = instance;
