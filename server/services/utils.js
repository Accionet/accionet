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

exports.cloneObject = function (obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  let copy;
  try {
    copy = obj.constructor();
  } catch (err) {
    copy = {};
  }
  //eslint-disable-next-line
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

exports.randomInteger = function (min, max) {
  return min + Math.floor(Math.random() * ((max + 1) - min));
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
