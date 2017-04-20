function mapForGraph(entries) {
  const parsedEntries = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const date = dateFromDayAndYear(entry.year, entry.doy);
    parsedEntries.push([date.getTime(), entry.amount]);
  }
  return parsedEntries;
}


function dateFromDayAndYear(year, day) {
  const date = new Date(Date.UTC(year, 0)); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}


exports.forGraph = mapForGraph;
