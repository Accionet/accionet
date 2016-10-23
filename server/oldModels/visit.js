'use strict';


// server/models/visit.js
const path = require('path');
const pg = require('pg');
const base = require('../models/base');

const table_name = 'visits';
const connectionString = require(path.join(__dirname, '../', '../', 'config'));


// Return all the entries active or not
exports.all = function getEntries(callback) {
    base.all(table_name, callback);
};

// Returns the amount of entries in such table
exports.count = function countAmountOf(attr, callback) {
    base.count(attr, table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function newEntry(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function saveEntry(attr, callback) {
    base.save(attr, table_name, callback);
};

exports.update = function updateEntry(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.find = function findEntry(attr, callback) {
    base.find(attr, table_name, callback);
};

exports.findById = function findEntry(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function findOneEntry(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
    base.columnNames(table_name, callback);
};

exports.delete = function deleteEntry(id, callback) {
    base.delete(id, table_name, callback);
};

// SELECT date_trunc('hour', date) AS "Day", count(*) AS "No. of users" FROM visits WHERE date > now() - interval '3 months' AND event_id = 4 GROUP BY 1 ORDER BY 1;

// SELECT EXTRACT(DOY from date) as doy, event_id, count(*) as amount FROM visits GROUP BY doy, event_id ORDER BY doy, event_id

exports.amountByDay = function (attr, callback) {
    let results = [];
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return callback(err);
        }

        // SQL Query > Delete Data
        const params = base.parseJsonToParams(attr);
        let string_query = 'SELECT EXTRACT(DOY from created_at) as doy, count(*) as amount FROM visits';
        string_query += base.getWhereFromParams(params, true);
        string_query += ' GROUP BY doy ORDER BY doy';

        const query = client.query(string_query, params.values);

        // SQL Query > Select Data

        results = [];

        query.on('error', (err) => (callback(err)));
        // Stream results back one row at a time
        query.on('row', (row) => {
            const date = dateFromDay(2016, row.doy).getTime();
            results.push([date, row.amount]);
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            return callback(null, results);
        });
    });
};

function dateFromDay(year, day) {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
}

exports.getFirstDate = function (attr, callback) {
    base.getFirstDate(attr, table_name, callback);
};

exports.countEndUser = function (attr, callback) {
    // SELECT COUNT(*) FROM (SELECT DISTINCT macaddress FROM response WHERE survey_id = 2) AS temp;
    const params = base.parseJsonToParams(attr);
    // build the query
    let string_query = `SELECT COUNT(*) FROM (SELECT DISTINCT macaddress FROM ${table_name} `;
    // Include the attr
    string_query += base.getWhereFromParams(params, true);
    string_query += ') AS temp';
    let result;

    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return callback(err);
        }
        const query = client.query(string_query, params.values);

        query.on('error', (err) => {
            done();
            return callback(err);
        });

        query.on('row', (row) => {
            result = row.count;
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();

            callback(null, result);
        });
    });
};

exports.amountByHour = function (attr, callback) {
    let results = [];
    // "SELECT EXTRACT(HOUR from created_at) AS hour, count(*) AS amount FROM visits GROUP BY hour ORDER BY hour"

    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return callback(err);
        }


        const params = base.parseJsonToParams(attr);
        let string_query = `SELECT EXTRACT(HOUR from created_at) AS hour, count(*) AS amount FROM ${table_name} `;
        string_query += base.getWhereFromParams(params, true);
        string_query += ' GROUP BY hour ORDER BY hour ';

        const query = client.query(string_query, params.values);

        // SQL Query > Select Data

        results = [];

        query.on('error', (err) => (callback(err)));

        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push([new Date(null, null, null, row.hour).getTime(), row.amount]);
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            // fill with missing hours
            for (let h = 0; h < 24; h++) {
                let present = false;
                for (let i = 0; i < results.length; i++) {
                    if (new Date(results[i][0]).getHours() === h) {
                        present = true;
                        break;
                    }
                }
                if (!present) {
                    results.push([new Date(null, null, null, h).getTime(), 0]);
                }
            }
            results.sort((a, b) => (a[0] - b[0]));
            return callback(null, results);
        });
    });
};

exports.tableDateAndHour = function (attr, callback) {
    const results = {};
    const data = [];
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return callback(err);
        }

        // SQL Query > Delete Data
        const params = base.parseJsonToParams(attr);
        let string_query = `SELECT EXTRACT(doy FROM created_at) as doy, EXTRACT(hour FROM created_at) as hour, count(*) as amount FROM ${table_name} `;
        string_query += base.getWhereFromParams(params, true);
        string_query += '  GROUP BY doy, hour ORDER BY doy,hour ';
        const query = client.query(string_query, params.values);


        query.on('error', (err) => (callback(err)));

        // Stream results back one row at a time
        query.on('row', (row) => {
            const date = dateFromDay(2016, row.doy).toString().substring(0, 15);
            if (!results[date]) {
                results[date] = new Array(24);
            }

            results[date][row.hour] = row.amount;
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            for (let i = 0; i < Object.keys(results).length; i++) {
                const date = Object.keys(results)[i];
                const dataFromDate = [];
                for (let j = 0; j < 24; j++) {
                    const hours = new Date(null, null, null, j).getTime();
                    let amount;
                    if (results[Object.keys(results)[i]][j]) {
                        amount = results[Object.keys(results)[i]][j];
                        // dataFromDate.push([new Date(null, null, null, h).getTime(), results[Object.keys(results)[i]][j]);
                    } else {
                        amount = 0;
                    }
                    dataFromDate.push([hours, amount]);
                }
                data.push({
                    label: date,
                    data: dataFromDate,
                });
            }
            return callback(null, data);
        });
    });
};
