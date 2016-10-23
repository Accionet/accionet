// This is justa a basic example is in here for copy and paste when creating a new model.
// Simulates inheritance
'use strict';


// server/models/interface.js

const base = require('../models/base');

const table_name = '';


// Return all the entries active or not
exports.all = function getEntries(callback) {
    base.all(table_name, callback);
};

// Returns the amount of entries in such table
exports.count = function countAmountOf(callback) {
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

exports.getFirstDate = function (attr, callback) {
    base.getFirstDate(attr, table_name, callback);
};

exports.delete = function deleteEntry(id, callback) {
    base.delete(id, table_name, callback);
};
