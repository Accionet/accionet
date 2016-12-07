
const FIRST_HEADER = 'Día';

function headerTitle(i) {
  return `${i}:00 - ${i}:59`;
}

function adaptDayHourTable(table, sheetname) {
  return {
    name: sheetname,
    firstRow: getHeaders(),
    data: adaptData(table),
  };
}

function adaptData(table) {
  const data = [];
  for (let i = 0; i < table.length; i++) {
    const newEntry = generateEntry(table[i]);
    data.push(newEntry);
  }
  return data;
}

function generateEntry(json) {
  const entry = {};
  entry[FIRST_HEADER] = json.label;
  for (let i = 0; i < json.data.length; i++) {
    entry[headerTitle(i)] = parseInt(json.data[i][1], 10);
  }
  return entry;
}

function getHeaders() {
  const headers = [FIRST_HEADER];
  for (let i = 0; i < 24; i++) {
    headers.push(headerTitle(i));
  }
  return headers;
}


exports.forExcel = adaptDayHourTable;
