// server/models/places.js
'use strict';


const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');


function parseJsonToParams(json) {
    const params = {
        keys: [],
        values: [],
    };
    // try, it will fail if json is not a json
    try {
        for (let i = 0; i < Object.keys(json).length; i++) {
            params.keys.push(Object.keys(json)[i]);
            params.values.push(json[Object.keys(json)[i]]);
        }
    } catch (e) {
        return params;
    }
    return params;
}

// returns a string containing the where clause for the given params. addWhere specify if it should contain the 'WHERE or not'
function getWhereFromParams(params, addWhere) {
    // if params is empty just return
    if (!params || !params.keys || params.keys.length === 0) {
        return '';
    }
    let string = '';
    if (addWhere) {
        string += ' WHERE ';
    }
    for (let j = 0; j < params.keys.length; j++) {
        string += ` ${params.keys[j]} = ($${j + 1}) AND `;
    }
    // delete the last "AND"
    string = string.substring(0, string.length - 4);
    return string;
}

exports.getWhereFromParams = getWhereFromParams;

exports.parseJsonToParams = parseJsonToParams;

// ################################# SELECT OR FIND

function findById(id, table_name, callback) {
    const attr = {
        id,
    };
    find(attr, table_name, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results[0]);
    });
}

exports.findById = findById;


// build select query

function buildSelectQuery(json, table_name) {
    const params = parseJsonToParams(json);

    // include de options UNION the ones without options
    let string = `SELECT * FROM ${table_name}`;
    string += getWhereFromParams(params, true);
    return string;
}

// params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildSelectWithWhereQuery(params, table_name) {
    let query = `SELECT  ${table_name}`;
    for (let j = 0; j < params.keys.length; j++) {
        query += ` WHERE ${params.keys[j]} = ($ ${j + 1}) AND`;
    }
    // delete the last "AND"
    query = query.substring(0, query.length - 3);

    return query;
}

function find(attr, table_name, callback) {
    const results = [];
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            return callback(err);
        }
        const query_string = buildSelectQuery(attr, table_name);
        const params = parseJsonToParams(attr);
        const query_all_surveys = client.query(query_string, params.values);

        query_all_surveys.on('error', (err) => {
            callback(err);
        });
        query_all_surveys.on('row', (row) => {
            results.push(row);
        });
        query_all_surveys.on('end', () => {
            done();
            return callback(null, results);
        });
    });
}


exports.find = find;


exports.findOne = function functionName(params, table_name, callback) {
    const deferrer = q.defer();
    let result;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        let string_query = buildSelectWithWhereQuery(params, table_name);
        string_query += ' LIMIT 1;';
        // SQL Query > Select Data
        const query = client.query(string_query, params.values);

        // Stream results back one row at a time
        query.on('row', (row) => {
            result = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            deferrer.resolve(result);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};


// Return all
exports.all = function (table_name, callback) {
    find(null, table_name, callback);
};

exports.count = function countAmountOf(table_name, callback) {
    const deferrer = q.defer();
    let result;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            // SQL Query > Select Data
            const query = client.query(`SELECT COUNT(*) FROM ${table_name};`);

            // Stream results back one row at a time
            query.on('row', (row) => {
                result = row.count;
            });

            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                deferrer.resolve(result);
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


// ################################## save

// Creates a json representing an empty object of the table given
exports.new = function newEntry(table_name, callback) {
    const deferrer = q.defer();
    const place = {};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }
        // SQL Query > Select Data
        const query = client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table_name}';`);

        // Stream results back one row at a time
        query.on('row', (row) => {
            place[row.column_name] = null;
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            deferrer.resolve(place);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};

// params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildInsertIntoQuery(params, table_name) {
    let query = `INSERT INTO  ${table_name} (`;
    for (let j = 0; j < params.keys.length; j++) {
        query += ` ${params.keys[j]},`;
    }
    // delete the last ","
    query = query.substring(0, query.length - 1);


    query += ') values(';
    for (let i = 0; i < params.keys.length; i++) {
        query += ` $${(i + 1)},`;
    }

    // delete the last ","
    query = query.substring(0, query.length - 1);

    query += ') RETURNING *;';
    return query;
}


// gets a regular json and convert it to a json of the form: params = { keys: [], values: []} including all the keys
function parseForSave(table_name, regular_json, callback) {
    const deferrer = q.defer();
    regular_json.created_at = new Date();
    regular_json.updated_at = new Date();

    getColumnNames(table_name, (err, columns) => {
        if (err) {
            deferrer.reject(err);
        }
        const params = {
            keys: [],
            values: [],
        };
        for (let i = 0; i < columns.length; i++) {
            // id cannot be set
            if (columns[i].localeCompare('id') !== 0) {
                params.keys.push(columns[i]);
                params.values.push(regular_json[columns[i]]);
            }
        }


        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

// Creates a json with the attr in attr. return true if its saved
exports.save = function saveEntry(attr, table_name, callback) {
    const deferrer = q.defer();

    let entry = null;

    parseForSave(table_name, attr, (err, params) => {
        if (err) {
            deferrer.reject(err);
        }
        // Get a Postgres client from the connection pool
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                done();
                deferrer.reject(err);
            }
            const query_string = buildInsertIntoQuery(params, table_name);
            console.log(query_string);

            const query = client.query(query_string, params.values);

            query.on('error', (err) => {
                return deferrer.reject(err);
            });
            query.on('row', (row) => {
                entry = row;
            });


            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                deferrer.resolve(entry);
            });
            deferrer.promise.nodeify(callback);
            return deferrer.promise;
        });
    });
};


// ##################################
// ################################## update
// ##################################


// params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildUpdateQuery(id, params, table_name) {
    // UPDATE places SET name=($1), is_active=($2) WHERE id=($3)
    let query = `UPDATE  ${table_name} SET`;
    for (let j = 0; j < params.keys.length; j++) {
        query += ` ${params.keys[j]} =($${(j + 1)}),`;
    }
    // delete the last ","
    query = query.substring(0, query.length - 1);

    query += ` WHERE id=($${(params.keys.length + 1)}`;
    query += ') RETURNING *;';

    return query;
}


// gets a regular json and convert it to a json of the form: params = { keys: [], values: []} including only the keys in the regular json
function parseForUpdate(table_name, regular_json, callback) {
    const deferrer = q.defer();

    regular_json.updated_at = new Date();


    getColumnNames(table_name, (err, columns) => {
        if (err) {
            deferrer.reject(err);
        }
        const params = {
            keys: [],
            values: [],
        };

        for (let i = 0; i < columns.length; i++) {
            // id cannot be set nor created_at
            if (columns[i].localeCompare('id') !== 0 && columns[i].localeCompare('created_at') !== 0) {
                // only update existing things
                if (regular_json.hasOwnProperty(columns[i])) {
                    params.keys.push(columns[i]);
                    params.values.push(regular_json[columns[i]]);
                }
            }
        }

        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}


function sendUpdateRequest(id, attr, table_name, callback) {
    const deferrer = q.defer();

    parseForUpdate(table_name, attr, (err, params) => {
        if (err) {
            deferrer.reject(err);
        } else {
            // Get a Postgres client from the connection pool
            pg.connect(connectionString, (err_connect, client, done) => {
                // Handle connection errors
                if (err_connect) {
                    done();
                    deferrer.reject(err);
                } else {
                    const query_string = buildUpdateQuery(id, params, table_name);
                    params.values.push(id);
                    const query = client.query(query_string, params.values);

                    // After all data is returned, close connection and return results
                    query.on('end', () => {
                        findById(id, table_name, (err_find, entry) => {
                            if (err_find) {
                                deferrer.reject(err);
                            } else {
                                deferrer.resolve(entry);
                            }
                            done();
                        });
                    });
                }
                deferrer.promise.nodeify(callback);
                return deferrer.promise;
            });
        }
    });
}

exports.update = sendUpdateRequest;


exports.getParamsName = getColumnNames;

function getColumnNames(table_name, callback) {
    const deferrer = q.defer();
    const names = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        // SQL Query > Select Data
        const query = client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table_name}';`);
        // Stream results back one row at a time
        query.on('row', (row) => {
            names.push(row.column_name);
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            deferrer.resolve(names);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

exports.toggleIsActive = function toggleIsActive(id, table_name, callback) {
    const deferrer = q.defer();
    let is_active = null;
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            const query = client.query(`SELECT is_active FROM ${table_name} WHERE id = ($1)`, [id]);

            query.on('row', (row) => {
                is_active = row.is_active;
            });

            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                const attr = {
                    is_active: !is_active,
                };
                sendUpdateRequest(id, attr, table_name, callback);
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


// delete

exports.delete = function (id, table_name, callback) {
    const deferrer = q.defer();

    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            const query = client.query(`delete FROM ${table_name} WHERE id = ($1) RETURNING *`, [id]);


            // After all data is returned, close connection and return results
            query.on('end', (entry) => {
                deferrer.resolve(entry);
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};
