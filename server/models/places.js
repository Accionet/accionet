// server/models/places.js
'use strict';
const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');
const base = require('../models/base');
const Visit = require('../models/visit');

const table_name = 'places';


// Return all the places active or not
exports.all = function getAllPlaces(callback) {
    base.all(table_name, callback);
};

exports.count = function countAmountOf(attr, callback) {
    base.count(attr, table_name, callback);
};

// Creates a json representing an empty place
exports.new = function newPlace(callback) {
    base.new(table_name, callback);
};


// Creates a json with the attr in attr
exports.save = function savePlace(attr, callback) {
    const deferrer = q.defer();

    setDefaultAttributes(attr);

    base.save(attr, table_name, (err, place) => {
        if (err) {
            deferrer.reject(err);
        } else {
            if (place) {
                deferrer.resolve(place);
            }
            // It should never get to here
            deferrer.reject('ERROR');
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


function setDefaultAttributes(attr) {
    if (!attr.is_active) {
        attr.is_active = false;
    }
}

exports.update = function updatePlace(id, attr, callback) {
    const deferrer = q.defer();


    base.update(id, attr, table_name, (err, place) => {
        if (err) {
            deferrer.reject(err);
        } else {
            deferrer.resolve(place);
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


// ######### FIX FROM HERE DOWN

exports.toggleIsActive = function toggleIsActive(id, callback) {
    const deferrer = q.defer();
    let is_active = null;
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            const query = client.query('SELECT is_active FROM places WHERE id = ($1)', [id]);


            query.on('row', (row) => {
                is_active = row.is_active;
            });

            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                const attr = {
                    is_active: !is_active,
                };
                base.update(id, attr, table_name, callback);
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


exports.metrics = function (id, callback) {
    Visit.amountByDay({
        place_id: id,
    }, (err, daily) => {
        if (err) {
            return callback(err);
        }
        Visit.amountByHour({
            place_id: id,
        }, (err, hourly) => {
            if (err) {
                return callback(err);
            }
            Visit.tableDateAndHour({
                place_id: id,
            }, (err, table) => {
                if (err) {
                    return callback(err);
                }
                const metrics = {
                    daily,
                    hourly,
                    table,
                };
                callback(null, metrics);
            });
        });
    });
};


exports.find = function (attr, callback) {
    base.find(attr, table_name, callback);
};

exports.findById = function getById(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function getFirst(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};
