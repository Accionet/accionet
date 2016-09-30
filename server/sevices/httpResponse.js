// server/services/jsonBuilder.js


exports.success = function buldSuccessJSON(text, key, value) {
    const json = {
        message: text,
    };
    json[key] = value;
    return json;
};

exports.error = function buildErrorJSON(err) {
    const error_string = `ERROR: ${err}`;
    const json = {
        error: error_string,
    };

    return json;
};
