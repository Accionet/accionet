//This is justa a basic example is in here for copy and paste when creating a new model.
// Simulates inheritance


//server/models/answer.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var base = require('../models/base.js');

var table_name = "answer";



//Return all the entries active or not
exports.all = function(callback) {
    base.all(table_name, callback);
};

//Creates a json representing an empty entry
exports.new = function(callback) {
    base.new(table_name, callback);
};

//Creates a json with the attr in attr
exports.save = function(attr, callback) {
    base.save(attr, table_name, callback);
};

exports.update = function(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.findById = function(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};


//returns all the answers that corresponds to a given response
exports.findOfSurvey = function findAnswersOfSurvey(survey_id, callback) {
    var deferrer = q.defer();
    var results = {};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }


        var query = client.query("SELECT * FROM " + table_name + " WHERE response_id IN (SELECT id FROM response WHERE survey_id = $1);", [survey_id]);

        query.on('row', function(row) {
          //add the answer to the corresponding response
          if(!results[row.response_id])
            results[row.response_id] = {};
            results[row.response_id][row.question_id] = {
                answer_option_id: row.answer_option_id,
                answer_text: row.answer_text
            };
         //add the timestamps
         results[row.response_id].created_at = row.created_at;
         results[row.response_id].updated_at = row.updated_at;

        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(results);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.columnNames = function(callback) {
    base.columnNames(table_name, callback);
};
