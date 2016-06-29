//server/models/places.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');



//Return all the places active or not
exports.all = function(callback) {
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
        var query = client.query("SELECT * FROM places ORDER BY id ASC;");

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

//Creates a json representing an empty place
exports.new = function(callback) {

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
        var query = client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'places';");

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


/*Recieves a json with attr and parse them to become a place with all the attributes */
function parseToPlace(attr) {


    var place = {
        keys: [],
        values: []
    };


    //Add keys
    place.keys.push("name"); //0
    place.keys.push("description"); //1
    place.keys.push("is_active"); //2
    place.keys.push("daily_visits"); //3
    place.keys.push("created_at"); //4
    place.keys.push("updated_at"); //5
    place.keys.push("email"); //6
    place.keys.push("email_verified"); //7
    place.keys.push("status"); //8
    place.keys.push("password"); //9


    //Add attributes
    place.values.push(attr.name); //0
    place.values.push(attr.description); //1
    place.values.push(attr.is_active); //2
    place.values.push(attr.daily_visits); //3
    place.values.push(new Date()); //4
    place.values.push(new Date()); //5
    place.values.push(attr.email); //6
    place.values.push(false); //7
    place.values.push(attr.status); //8
    place.values.push("password"); //9

    //If status is not especified set it 0
    if (!place.values[8]) {
        place.values[8] = 0;
    }
    //If is_active is not especified set it to 0
    if (!place.values[2]) {
        place.values[2] = false;
    }
    return place;
}



//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildInsertIntoQuery(params) {

    query = "INSERT INTO places(";
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

    query += ");";

    console.log(query);
    return query;
}

//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildUpdateQuery(id, params) {
    //UPDATE places SET name=($1), is_active=($2) WHERE id=($3)
    query = "UPDATE places SET";
    for (var j = 0; j < params.keys.length; j++) {
        query += " " + params.keys[j] + "=($" + (j + 1) + "),";
    }
    //delete the last ","
    query = query.substring(0, query.length - 1);

    query += " WHERE id=($" + (params.keys.length + 1);
    query += ");";

    console.log(query);
    return query;
}

//Creates a json with the attr in attr
exports.save = function(attr, callback) {

    var deferrer = q.defer();

    place = parseToPlace(attr);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        query_string = buildInsertIntoQuery(place);
        var query = client.query(query_string, place.values);
        //    var query  = client.query("INSERT INTO places values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", values);



        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(place.name + " agregado exitósamente.");
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });


};

/*Similar idea tu parseToPlace method, but it doesn't include all the attributes, only the existing ones*/
function parseToPlaceForUpdate(attr) {
    var place = {
        keys: [],
        values: []
    };

    //Add keys
    place.keys.push("updated_at");

    if (attr.hasOwnProperty("name"))
        place.keys.push("name");
    if (attr.hasOwnProperty("description"))
        place.keys.push("description");
    if (attr.hasOwnProperty("is_active"))
        place.keys.push("is_active");
    if (attr.hasOwnProperty("daily_visits"))
        place.keys.push("daily_visits");
    if (attr.hasOwnProperty("email"))
        place.keys.push("email");
    if (attr.hasOwnProperty("email_verified"))
        place.keys.push("email_verified");
    if (attr.hasOwnProperty("status"))
        place.keys.push("status");
    if (attr.hasOwnProperty("password"))
        place.keys.push("password");
    //Add attributes
    //Updated_at
    place.values.push(new Date());
    if (attr.hasOwnProperty("name")) place.values.push(attr.name);
    if (attr.hasOwnProperty("description")) place.values.push(attr.description);
    if (attr.hasOwnProperty("is_active")) place.values.push(attr.is_active);
    if (attr.hasOwnProperty("daily_visits")) place.values.push(attr.daily_visits);
    if (attr.hasOwnProperty("email")) place.values.push(attr.email);
    if (attr.hasOwnProperty("email_verified")) place.values.push(attr.email_verified);
    if (attr.hasOwnProperty("status")) place.values.push(attr.status);
    if (attr.hasOwnProperty("password")) place.values.push(attr.password);
    return place;
}

function sendUpdateRequest(id, attr, callback) {

    var deferrer = q.defer();

    place = parseToPlaceForUpdate(attr);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        var query_string = buildUpdateQuery(id, place);

        place.values.push(id);
        var query = client.query(query_string, place.values);


        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            findPlaceById(id, function(err, place) {
                if (err) {
                    console.log("ERROR: " + err);
                    deferrer.reject(err);
                }
                response = {
                    message: "Cambios a " + place.name + " agregados exitosamente.",
                    place: place
                };
                deferrer.resolve(response);
            });

        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });


}

exports.update = sendUpdateRequest;


exports.toggleIsActive = function(id, callback) {
    var deferrer = q.defer();
    var is_active = null;
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        console.log("toggle");
        console.log(id);
        var query = client.query("SELECT is_active FROM places WHERE id = ($1)", [id]);


        query.on('row', function(row) {
            console.log(row);
            is_active = row.is_active;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            attr = {
                is_active: !is_active
            };
            sendUpdateRequest(id, attr, callback);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

};

function findPlaceById(id, callback) {

    var deferrer = q.defer();
    var place;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }


        var query = client.query("SELECT * FROM places WHERE places.id = $1", [id]);

        query.on('row', function(row) {
            place = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(place);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

exports.findById = findPlaceById;
