//server/models/surveys.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var base = require('../models/base.js');

var Questions = require('../models/questions.js');

var table_name = "surveys";



//Return all the entries active or not
exports.all = function(callback) {
    var deferrer = q.defer();
    var results = [];

    //get the amount of columns in options. This is to leave blank the spaces in the table of those who doesnt have options
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            deferrer.reject(err);
        }

        // SQL Query > Select Data
        var query = client.query("select count(*) as amount from information_schema.columns where table_name='options';");


        var amount = 0;
        query.on('row', function(row) {
            amount = row.amount;
        });
        // Stream results back one row at a time
        // After all data is returned, close connection and return results
        query.on('end', function() {


            query_string = buildSelectAllQuery(amount);
            console.log(query_string);

            var query = client.query(query_string);

            query.on('row', function(row) {
                results.push(row);
            });
            query.on('end', function() {
                done();
                deferrer.resolve(results);
            });

        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};


function buildSelectAllQuery(amount) {
    //include de options UNION the ones without options

    string = "SELECT * FROM( ";
    //build the inner query
    string += "SELECT surveys.id as s_id, questions.id as q_id, options.id as o_id, * FROM surveys, questions, options WHERE surveys.id = questions.survey_id AND options.question_id = questions.id ";
    string += " UNION ";
    string += " SELECT surveys.id as s_id, questions.id as q_id, null as o_id, *";

    for (var i = 0; i < amount; i++) {
        string += ", null";
    }
    string += " FROM surveys, questions WHERE surveys.id = questions.survey_id";

    string += " ) as pop_surveys ORDER BY s_id, q_id, enumeration;";

    return string;
}
//Creates a json representing an empty entry
exports.new = function(callback) {
    base.new(table_name, callback);
};

//Creates a json with the attr in attr
exports.save = function(attr, callback) {

    var deferrer = q.defer();
    base.save(attr, table_name, function(err, survey) {

        questions = attr.questions;



        for (var i = 0; i < questions.length; i++) {
            questions[i].survey_id = survey.id;
            Questions.save(questions[i], function(err, question) {
                if (err) {
                    console.log(err);
                }
            });
        }

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

exports.findOne = function(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function(callback) {
    base.columnNames(table_name, callback);
};
