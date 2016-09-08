// server/models/has_answer.js

// const path = require('path');
// const pg = require('pg');

// const connectionString = require(path.join(__dirname, '../', '../', 'config'));
// const q = require('q');
const base = require('../models/base');

const table_name = 'has_answer';


// Return all the entries active or not
exports.all = function allHasAnswer(callback) {
    base.all(table_name, callback);
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

exports.findById = function findById(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function findOne(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
    base.columnNames(table_name, callback);
};
