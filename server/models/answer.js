// server/models/answer.js

const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');

const base = require('../models/base');

const table_name = 'answer';


// Return all the entries active or not
exports.all = function getAll(callback) {
    base.all(table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function getNew(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function getSave(attr, callback) {
    base.save(attr, table_name, callback);
};

exports.update = function updateAnswer(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.findById = function findAnswer(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function findFirst(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

function findRespondeInArray(results, id) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].id && results[i].id === id) {
            return i;
        }
    }
    return -1;
}


// returns all the answers that corresponds to a given response
exports.findOfSurvey = function findAnswersOfSurvey(survey_id, callback) {
    const deferrer = q.defer();
    const results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        const query = client.query(`SELECT * FROM ${table_name} WHERE response_id IN (SELECT id FROM response WHERE survey_id = $1);`, [survey_id]);
        query.on('row', (row) => {
            // get the current index
            let response_index = findRespondeInArray(results, row.response_id);
            // if it doest exist
            if (response_index === -1) {
                response_index = results.length;
                results.push({
                    id: row.response_id,
                });
            }
            // add the answer to the corresponding response
            results[response_index][row.question_id] = {
                answer_option_id: row.answer_option_id,
                answer_text: row.answer_text,
            };

            // add the timestamps
            results[response_index].created_at = row.created_at;
            results[response_index].updated_at = row.updated_at;
        });

        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            deferrer.resolve(results);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.columnNames = function getColumnNames(callback) {
    base.columnNames(table_name, callback);
};


exports.getMetrics = function (question, callback) {
    switch (question.type) {
    case 'multiple_choice':
        getMetricsOfMulltipleChoice(question, callback);
        break;
    default:
    }
};

function getMetricsOfMulltipleChoice(question, callback) {
    const deferrer = q.defer();
    const metrics = {};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            const query = client.query('SELECT enumeration, statement, count(*) FROM answer, options WHERE answer.question_id = $1 AND options.question_id = $1 AND answer.answer_option_id = options.id GROUP BY enumeration, statement ORDER BY enumeration', [question.id]);
            query.on('row', (row) => {
                metrics[row.enumeration] = {
                    statement: row.statement,
                    count: row.count,
                };
            });

            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                question.metrics = metrics;
                deferrer.resolve(question);
            });
        }
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

    deferrer.promise.nodeify(callback);
    return deferrer.promise;
}
