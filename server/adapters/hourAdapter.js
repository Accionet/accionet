// Metrics separated by hour


function forGraph(entries) {
  const parsedEntries = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const time = new Date(null, null, null, entry.hour).getTime();
    parsedEntries.push([time, entry.amount]);
  }
  fillMissingHours(parsedEntries);
  return parsedEntries;
}

function hourPresentIn(hour, array) {
  for (let i = 0; i < array.length; i++) {
    if (new Date(array[i][0]).getHours() === hour) {
      return true;
    }
  }
  return false;
}

function fillMissingHours(array) {
  for (let h = 0; h < 24; h++) {
    if (!hourPresentIn(h, array)) {
      array.push([new Date(null, null, null, h).getTime(), 0]);
    }
  }
  array.sort((a, b) => {
    return a[0] - b[0];
  });
}

exports.forGraph = forGraph;
