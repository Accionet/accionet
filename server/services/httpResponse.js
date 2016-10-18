// server/services/jsonBuilder.js


exports.success = function (text, keys, values) {
    const json = {
        message: text,
    };

    if (Object.prototype.toString.call(keys) === '[object Array]') {
        for (let i = 0; i < keys.length; i++) {
            json[keys[i]] = values[i];
        }
    } else {
        json[keys] = values;
    }
    return json;
};

exports.error = function buildErrorJSON(err) {
    const json = {
        error: err,
    };

    return json;
};
