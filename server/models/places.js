//server/models/places.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var base = require('../models/base.js');

var table_name = "places";



//Return all the places active or not
exports.all = function(callback) {
    base.all(table_name, callback);
};

//Creates a json representing an empty place
exports.new = function(callback) {

    base.new(table_name, callback);
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




//Creates a json with the attr in attr
exports.save = function(attr, callback) {

    var deferrer = q.defer();

    setDefaultAttributes(attr);

    base.save(attr, table_name, function(err, success) {
        if (err) {
            deferrer.reject(err);
        }
        if (success)
            deferrer.resolve(attr.name + " agregado exitósamente.");

        //It should never get to here
        deferrer.reject("ERROR");
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


function setDefaultAttributes(attr) {
    if(!attr.is_active)
      attr.is_active = false;
}

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

exports.update = function(id, attr, callback) {

    var deferrer = q.defer();



    base.update(id, attr, table_name, function(err, place) {

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
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};


//######### FIX FROM HERE DOWN

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
            base.update(id, attr, table_name, callback);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

};

exports.findById = function(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function(id, attr, callback) {
    base.findOne(id, place, table_name, callback);
};
