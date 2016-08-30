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
            console.log(attr.answers[i]);
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

exports.findOne = function(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function(callback) {
    base.columnNames(table_name, callback);
};
