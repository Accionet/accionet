const fs = require('fs');
const path = require('path');

exports.getHotspot = function (req, res) {
  fs.readFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'template.html'), 'utf8', (err, data) => {
    fs.readFile(path.join(__dirname, '../', '../', 'client', 'views', 'hotspotTemplates', 'image', 'defaultValues.json'), 'utf8', (errJson, json) => {
      console.log(json);
      if (err || errJson) {
        console.log(errJson);
        return console.log(err || errJson);
      }
    });
  });
};
