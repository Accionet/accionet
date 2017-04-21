const table = require('./table'); // eslint-disabled-this-line no-unused-vars
const EndUserDecorator = require('./decorators/CountEndUsers');
const DayMetricsDecorator = require('./decorators/DayMetrics');
const HourMetricsDecorator = require('./decorators/HourMetrics');
const DayAndHourMetricDecorator = require('./decorators/DayAndHourMetrics');
const AccessibleParent = require('./decorators/AccessibleParent');


class Visits extends table {

  constructor() {
    const table_name = 'visits';
    super(table_name);
  }
}

const instance = new Visits();

// decorate
EndUserDecorator.addCountEndUsers(instance);
DayMetricsDecorator.addDayMetrics(instance);
HourMetricsDecorator.addHourMetrics(instance);
DayAndHourMetricDecorator.addDayAndHourTable(instance);

AccessibleParent.decorate(instance, require('./places'));

module.exports = instance;
