//server/models/response.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var base = require('../models/base.js');

var table_name = "response";

var Answer = require("./answer.js");



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
    var deferrer = q.defer();
    base.save(attr, table_name, function(err, response) {
        if (err)
            deferrer.reject(err);
        for (var i = 0; i < attr.answers.length; i++) {
            attr.answers[i].response_id = response.id;
            Answer.save(attr.answers[i], function(err, answer) {
                if (err) {
                    deferrer.reject(err);
                }
            });
        }
        deferrer.resolve(response);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};

exports.update = function(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.findById = function(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOfSurvey = function(id, callback) {
    var deferrer = q.defer();
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }


        var query = client.query("SELECT * FROM " + table_name + " WHERE survey_id = $1", [id]);

        query.on('row', function(row) {

        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(obj);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.findOne = function(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function(callback) {
    base.columnNames(table_name, callback);
};
