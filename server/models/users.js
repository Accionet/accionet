// server/models/users.js

const path = require('path');
const pg = require('pg');
const q = require('q');
const base = require('../models/base');
const bcrypt = require('bcrypt-nodejs');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const table_name = 'users';


// Return all the entries active or not
exports.all = function getUsers(callback) {
    base.all(table_name, callback);
};

exports.count = function countUsers(callback) {
    base.count(table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function newUser(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function saveUser(attr, callback) {
    setDefaultAttributes(attr);
    base.save(attr, table_name, callback);
};

exports.update = function updateUser(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};

exports.findById = function findUser(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function findFirst(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

function setDefaultAttributes(attr) {
    encryptPassword(attr);

    // if it doesnt exists
    if (!attr.email_verified) {
        attr.email_verified = false;
    }
    if (!attr.is_active) {
        attr.is_active = false;
    }
}


function encryptPassword(attr) {
    attr.password = bcrypt.hashSync(attr.password, bcrypt.genSaltSync(8), null);
}


// Checks if the password corresponds to the id given
function isCorrectPassword(id, password) {
    // pg.connect(connectionString, function(err, client, done) {
    //     // Handle connection errors
    //     if (err) {
    //         done();
    //         console.log(err);
    //         return false;
    //     }
    //
    //     // SQL Query > Select Data
    //     var query = client.query("SELECT password FROM " + table_name + " WHERE id = ($1)", id);
    //
    //     // Stream results back one row at a time
    //
    //
    //     // After all data is returned, close connection and return results
    //     query.on('end', function(encrypted_password) {
    //         return bcrypt.compareSync(password, encrypted_password);
    //     });
    // });
    return true;
}

exports.isUsernameTaken = function checkValidUsername(username, callback) {
    const deferrer = q.defer();
    const results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            // SQL Query > Select Data
            const query = client.query(`SELECT COUNT(*) FROM  ${table_name} WHERE username LIKE ($1)`, username);

            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', (result) => {
                done();
                deferrer.resolve(result);
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};
