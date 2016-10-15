// server/models/response.js
'use strict';

const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');
const base = require('../models/base');

const table_name = 'response';

const Answer = require('./answer');


// Return all the entries active or not
exports.all = function allResponses(callback) {
    base.all(table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function newResponse(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function saveResponse(attr, callback) {
    const deferrer = q.defer();
    base.save(attr, table_name, (err, response) => {
        if (err) {
            deferrer.reject(err);
        } else {
            for (let i = 0; i < attr.answers.length; i++) {
                attr.answers[i].response_id = response.id;
                Answer.save(attr.answers[i], (err_ans) => {
                    if (err_ans) {
                        deferrer.reject(err_ans);
                    }
                });
            }
            deferrer.resolve(response);
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.update = function updateResponse(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.findById = function findResponseById(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOfSurvey = function getResponsesOfSurvey(id, callback) {
    const deferrer = q.defer();
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            const query = client.query(`SELECT * FROM ${table_name} WHERE survey_id = $1`, [id]);

            query.on('row', (row) => {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                deferrer.resolve(results);
            });
        }
    });

    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.findOne = function findFirst(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
    base.columnNames(table_name, callback);
};
