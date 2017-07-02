const fs = require('fs');
const utils = require('./utils');
const path = require('path');

const compileString = function (string, values) {
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
    const search = new RegExp(inTextKey, 'g');
    string = string.replace(search, values[keys[i]]);
  }
  return string;
};

const compileFile = function (path, values) {
  fs.readFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'template.html'), 'utf8', (err, data) => {
    if (err) {
      return {
        error: err,
      };
    }
    return compileString(data, values);
  });
};

exports.compileVisitCounter = function (hotspot_id) {
  const values = {
    HOST: utils.HOST,
    HOTSPOT_ID: hotspot_id,
  };
  return compileFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'javascripts', 'visitCounter.js'), values);
};


exports.compile = compileString;
