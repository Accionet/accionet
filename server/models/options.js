
//server/models/options.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var base = require('../models/base.js');

var table_name = "options";



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

exports.columnNames = function(callback) {
    base.columnNames(table_name, callback);
};
