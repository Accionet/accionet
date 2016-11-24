const DayAdapter = require('./dayAdapter');
const HourAdapter = require('./hourAdapter');


exports.mapForDailyGraph = DayAdapter.forGraph;

exports.mapForHourlyGraph = HourAdapter.forGraph;
