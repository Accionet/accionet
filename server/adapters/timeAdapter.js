const DayAdapter = require('./dayAdapter');
const HourAdapter = require('./hourAdapter');
const DayAndHourAdapter = require('./dayAndHourAdapter');


exports.mapForDailyGraph = DayAdapter.forGraph;

exports.mapForHourlyGraph = HourAdapter.forGraph;

exports.mapForDayAndHourGraph = DayAndHourAdapter.forGraph;
