// server/services/utils.js

const fs = require('fs');
const mime = require('mime');

// function isNumber() {
//
// }
function isJson(x) {
    // check if its null
  if (!x) {
    return false;
  }
  return (typeof x) === 'object';
}

exports.isJSON = isJson;

exports.isEmptyJSON = function (x) {
  // if it is not a json then it is not an empty json
  if (!isJson(x)) {
    return false;
  }
  return Object.keys(x).length === 0;
};

exports.sendFile = function (filepath, filename, fileExtension, res) {
  try {
    const mimetype = mime.lookup(filepath);

    res.setHeader('Content-disposition', `attachment; filename=${filename}.${fileExtension}`);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(filepath);
    filestream.pipe(res);

    filestream.on('close', (err) => {
      if (err) return res.send(500);
      fs.unlink(filepath);
    });
  } catch (e) {
    return res.send(500);
  }
};
