//server/models/places.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');



//################################# SELECT OR FIND


exports.findById = findEntryById;


function findEntryById(id, table_name, callback) {

    var deferrer = q.defer();
    var obj;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }


        var query = client.query("SELECT * FROM " + table_name + " WHERE places.id = $1", [id]);

        query.on('row', function(row) {
            obj = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(obj);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

exports.findOne = function functionName(params, table_name, callback) {
    var deferrer = q.defer();
    var result;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            deferrer.reject(err);
        }

        string_query = buildSelectWithWhereQuery(params, table_name);
        string_query += " LIMIT 1;";
        // SQL Query > Select Data
        var query = client.query(string_query, params.values);

        // Stream results back one row at a time
        query.on('row', function(row) {
            result = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(result);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};


//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildSelecWithWhereQuery(params, table_name) {
    //UPDATE places SET name=($1), is_active=($2) WHERE id=($3)
    query = "SELECT " + table_name;
    for (var j = 0; j < params.keys.length; j++) {
        query += " WHERE " + params.keys[j] + "=($" + (j + 1) + ") AND";
    }
    //delete the last "AND"
    query = query.substring(0, query.length - 3);

    return query;
}


//Return all
exports.all = function(table_name, callback) {
    var deferrer = q.defer();
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            deferrer.reject(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM " + table_name + " ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(results);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};



//################################## save

//Creates a json representing an empty object of the table given
exports.new = function(table_name, callback) {

    var deferrer = q.defer();
    var place = {};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }
        // SQL Query > Select Data
        var query = client.query("SELECT column_name FROM information_schema.columns WHERE table_name = '" + table_name + "';");

        // Stream results back one row at a time
        query.on('row', function(row) {
            place[row.column_name] = null;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(place);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};

//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildInsertIntoQuery(params, table_name) {

    query = "INSERT INTO " + table_name + "(";
    for (var j = 0; j < params.keys.length; j++) {
        query += " " + params.keys[j] + ",";
    }
    //delete the last ","
    query = query.substring(0, query.length - 1);


    query += ") values(";
    for (var i = 0; i < params.keys.length; i++) {
        query += " $" + (i + 1) + ",";
    }

    //delete the last ","
    query = query.substring(0, query.length - 1);

    query += ") RETURNING *;";

    return query;
}




//gets a regular json and convert it to a json of the form: params = { keys: [], values: []} including all the keys
function parseForSave(table_name, regular_json, callback) {

    var deferrer = q.defer();

    regular_json.created_at = new Date();
    regular_json.updated_at = new Date();

    getColumnNames(table_name, function(err, columns) {


        if (err) {
            console.log(err);
            deferrer.reject(err);
        }
        var params = {
            keys: [],
            values: []
        };
        for (var i = 0; i < columns.length; i++) {

            //id cannot be set
            if (columns[i].localeCompare('id') !== 0) {
                params.keys.push(columns[i]);
                params.values.push(regular_json[columns[i]]);
            }
        }

        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

}

//Creates a json with the attr in attr. return true if its saved
exports.save = function(attr, table_name, callback) {

    var deferrer = q.defer();

    var entry = null;
    parseForSave(table_name, attr, function(err, params) {

        // Get a Postgres client from the connection pool
        pg.connect(connectionString, function(err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                deferrer.reject(err);
            }
            query_string = buildInsertIntoQuery(params, table_name);



            var query = client.query(query_string, params.values);

            query.on('row', function(row) {

                entry = row;

            });


            // After all data is returned, close connection and return results
            query.on('end', function() {

                done();
                deferrer.resolve(entry);
            });
            deferrer.promise.nodeify(callback);
            return deferrer.promise;
        });
    });
};


//##################################
//################################## update
//##################################


//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildUpdateQuery(id, params, table_name) {
    //UPDATE places SET name=($1), is_active=($2) WHERE id=($3)
    query = "UPDATE " + table_name + " SET";
    for (var j = 0; j < params.keys.length; j++) {
        query += " " + params.keys[j] + "=($" + (j + 1) + "),";
    }
    //delete the last ","
    query = query.substring(0, query.length - 1);

    query += " WHERE id=($" + (params.keys.length + 1);
    query += ") RETURNING *;";

    return query;
}


//gets a regular json and convert it to a json of the form: params = { keys: [], values: []} including only the keys in the regular json
function parseForUpdate(table_name, regular_json, callback) {
    var deferrer = q.defer();

    regular_json.updated_at = new Date();



    getColumnNames(table_name, function(err, columns) {

        if (err) {
            console.log(err);
            deferrer.reject(err);
        }
        var params = {
            keys: [],
            values: []
        };

        for (var i = 0; i < columns.length; i++) {

            //id cannot be set nor created_at
            if (columns[i].localeCompare('id') !== 0 && columns[i].localeCompare('created_at') !== 0) {
                //only update existing things
                if (regular_json.hasOwnProperty(columns[i])) {
                    params.keys.push(columns[i]);
                    params.values.push(regular_json[columns[i]]);
                }
            }
        }

        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

}



function sendUpdateRequest(id, attr, table_name, callback) {

    var deferrer = q.defer();

    parseForUpdate(table_name, attr, function(err, params) {
        if (err) {
            done();
            deferrer.reject(err);
        }
        // Get a Postgres client from the connection pool
        pg.connect(connectionString, function(err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                deferrer.reject(err);
            }

            var query_string = buildUpdateQuery(id, params, table_name);

            params.values.push(id);
            var query = client.query(query_string, params.values);


            // After all data is returned, close connection and return results
            query.on('end', function() {
                findEntryById(id, table_name, function(err, entry) {
                    if (err)
                        deferrer.reject(err);
                    deferrer.resolve(entry);
                    done();
                });
            });

            deferrer.promise.nodeify(callback);
            return deferrer.promise;
        });

    });




}

exports.update = sendUpdateRequest;


exports.getParamsName = getColumnNames;

function getColumnNames(table_name, callback) {
    var deferrer = q.defer();
    var names = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT column_name FROM information_schema.columns WHERE table_name = '" + table_name + "';");
        // Stream results back one row at a time
        query.on('row', function(row) {
            names.push(row.column_name);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(names);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}
