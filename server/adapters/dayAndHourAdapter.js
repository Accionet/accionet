// Table Date and Hour
const HourAdapter = require('./hourAdapter');

function dateFromDayAndYear(year, day) {
  const date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

function addDateTo(results, row) {
  const date = dateFromDayAndYear(row.year, row.doy).toString().substring(0, 15);
  if (!results[date]) {
    results[date] = [];
  }
  results[date].push(row);
}

function parseHourOf(entries) {
  const parsedEntries = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const time = new Date(null, null, null, entry.hour).getTime();
    parsedEntries.push([time, entry.amount]);
  }
  return parsedEntries;
}

function mapForGraph(entries) {
  const data = [];
  const json = {};
  for (let i = 0; i < entries.length; i++) {
    addDateTo(json, entries[i]);
  }
  for (let i = 0; i < Object.keys(json).length; i++) {
    const date = Object.keys(json)[i];
    const dataFromDate = parseHourOf(json[date]);
    HourAdapter.fillMissingHours(dataFromDate);
    data.push({
      label: date,
      data: dataFromDate,
    });
  }
  return data;
}

exports.forGraph = mapForGraph;
