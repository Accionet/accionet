// server/services/utils.js

const fs = require('fs');
const mime = require('mime');

// function isNumber() {
//
// }

exports.isJSON = function isJson(x) {
    // check if its null
    if (!x) {
        return false;
    }
    try {
        JSON.parse(x);
        return true;
    } catch (e) {
        return false;
    }
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
