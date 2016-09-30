// server/services/jsonBuilder.js


exports.success = function buldSuccessJSON(text, key, value) {
    const json = {
        message: text,
    };
    json[key] = value;
    return json;
};

exports.error = function buildErrorJSON(err) {
    const json = {
        error: err,
    };

    return json;
};
