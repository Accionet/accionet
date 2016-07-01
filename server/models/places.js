//server/models/places.js

var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');
var Base = require('./base.js');

var table_name = 'places';



//###############################################
// NEW ##########################################
//###############################################

//Creates a json representing an empty place
exports.new = function(callback) {
    Base.new(table_name, callback);
};


//###############################################
// UPDATE #######################################
//###############################################

// /*Similar idea tu parseToPlace method, but it doesn't include all the attributes, only the existing ones*/
// function parseToPlaceForUpdate(attr) {
//     var place = {
//         keys: [],
//         values: []
//     };
//
//     //Add keys
//     place.keys.push("updated_at");
//
//     if (attr.hasOwnProperty("name"))
//         place.keys.push("name");
//     if (attr.hasOwnProperty("description"))
//         place.keys.push("description");
//     if (attr.hasOwnProperty("is_active"))
//         place.keys.push("is_active");
//     if (attr.hasOwnProperty("daily_visits"))
//         place.keys.push("daily_visits");
//     if (attr.hasOwnProperty("email"))
//         place.keys.push("email");
//     if (attr.hasOwnProperty("email_verified"))
//         place.keys.push("email_verified");
//     if (attr.hasOwnProperty("status"))
//         place.keys.push("status");
//     if (attr.hasOwnProperty("password"))
//         place.keys.push("password");
//     //Add attributes
//     //Updated_at
//     place.values.push(new Date());
//     if (attr.hasOwnProperty("name")) place.values.push(attr.name);
//     if (attr.hasOwnProperty("description")) place.values.push(attr.description);
//     if (attr.hasOwnProperty("is_active")) place.values.push(attr.is_active);
//     if (attr.hasOwnProperty("daily_visits")) place.values.push(attr.daily_visits);
//     if (attr.hasOwnProperty("email")) place.values.push(attr.email);
//     if (attr.hasOwnProperty("email_verified")) place.values.push(attr.email_verified);
//     if (attr.hasOwnProperty("status")) place.values.push(attr.status);
//     if (attr.hasOwnProperty("password")) place.values.push(attr.password);
//     return place;
// }

// exports.update = sendUpdateRequest;

exports.update = function(id, attr, callback) {

    var deferrer = q.defer();

    buildParamsForUpdate(attr, table_name, function(err, params) {
        if (err) {
            deferrer.reject(err);
        }
        Base.update(id, params, table_name, function(err, response) {

            if (err) {
                deferrer.reject(err);
            }

            deferrer.resolve(response);
            deferrer.promise.nodeify(callback);
            return deferrer.promise;

        });
    });

};

function removeColumn(array, obj) {
    var index = array.indexOf(obj);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}


//Returns an json with this form: params = {keys: [], values[]}. It contains only the keys that are also present in attr.
function buildParamsForUpdate(attr, table_name, callback) {
    console.log('-------------------------buildParamsForUpdate---------------------');
    var deferrer = q.defer();
    params = {
        keys: [],
        values: []
    };

    Base.columnNames(table_name, function(err, columnNames) {
        if (err) {
            deferrer.reject(err);
        }

        //remove Columns who should not edit
        columnNames = removeColumn(columnNames, 'id');
        columnNames = removeColumn(columnNames, 'created_at');
        columnNames = removeColumn(columnNames, 'updated_at');


        for (var i = 0; i < columnNames.length; i++) {
            if (attr.hasOwnProperty(columnNames[i])) {
                params.keys.push(columnNames[i]);
                params.values.push(attr[columnNames[i]]);
            }

        }

        //set updated_at
        params.keys.push('updated_at');
        params.values.push(new Date());

        console.log(params);
        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

exports.toggleIsActive = function(id, callback) {
    console.log('-----------------------------------IS ACTIVE-------------------------------------');
    var deferrer = q.defer();
    var is_active = null;
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        exports.findById(id, function(err, response) {
            if (err) {
                done();
                deferrer.reject(err);
            }

            done();
            place = response.results[0];
            attr = {
                is_active: !place.is_active
            };
            exports.update(id, attr, callback);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });

};

//###############################################
// SAVE #########################################
//###############################################

//Creates a json with the attr in attr
exports.save = function(attr, callback) {

    var deferrer = q.defer();

    //equivalent to before save
    buildParamsForSave(attr, table_name, function(err, params) {
        if (err) {
            deferrer.reject(err);
        }
        Base.save(params, table_name, function(err, response) {
            if (err) {
                deferrer.reject(err);
            }

            deferrer.resolve(response);
            deferrer.promise.nodeify(callback);
            return deferrer.promise;

        });
    });
};

//Returns an json with this form: params = {keys: [], values[]}. It contains all the keys.
function buildParamsForSave(attr, table_name, callback) {
    console.log('-------------------------buildParamsForSave---------------------');
    var deferrer = q.defer();
    params = {
        keys: [],
        values: []
    };

    Base.columnNames(table_name, function(err, columnNames) {
        if (err) {
            deferrer.reject(err);
        }

        //remove Columns who should not edit
        columnNames = removeColumn(columnNames, 'id');
        columnNames = removeColumn(columnNames, 'created_at');
        columnNames = removeColumn(columnNames, 'updated_at');
        params.keys = columnNames;

        for (var i = 0; i < params.keys.length; i++) {
            params.values.push(attr[params.keys[i]]);
        }

        //Add created_at and updated_at
        params.keys.push('created_at');
        params.values.push(new Date());
        params.keys.push('updated_at');
        params.values.push(new Date());

        //Set initial is_active to false if it is not initialized
        var index = params.keys.indexOf('is_active');
        if (index <= -1)
            deferrer.reject('Error: algo inesperado ocurrió.');
        if (!params.values[index])
            params.values[index] = false;
        console.log(params);
        deferrer.resolve(params);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}



//###############################################
// FIND ##########################################
//###############################################

// The function Base.find has these parameters: Base.find(table_name, return_params, search_params, order_by, order_type, offset, limit, callback) { ... }

//Return all the places active or not
exports.all = function(callback) {

    Base.find(table_name, null, null, 'id', 'ASC', 0, Base.NO_LIMIT, callback);
};

exports.findById = function(id, callback) {
    console.log("----------------------findById---------------------------");
    search_params = {
        keys: ['id'],
        values: [id]
    };
    Base.find(table_name, null, search_params, null, null, 0, Base.NO_LIMIT, callback);

};

exports.find = function(search_attr, callback) {
    //NOT TESTED
    search_params = {
        keys: [],
        values: []
    };
    search_params.keys = Object.keys(search_attr);
    search_params.values = Object.keys(search_attr).map(function(k) {
        return search_attr[k];
    });

    Base.find(table_name, null, search_params, null, null, 0, Base.NO_LIMIT, callback);
};

//search attr the attributes that will be use in WHERE __ = ($1)
//config_attr: Attributes for some configurations such us, offset, limit, order_by, order_type, etc.
exports.find = function(search_attr, config_attr, callback) {
    //NOT TESTED
    if (!search_attr && !config_attr) {
        return "Error";
    }
    search_params = {
        keys: [],
        values: []
    };
    search_params.keys = Object.keys(search_attr);
    search_params.values = Object.keys(search_attr).map(function(k) {
        return search_attr[k];
    });

    Base.find(table_name, null, search_params, config_attr.order_by, config_attr.order_type, config_attr.offset, config_attr.limit, callback);


};
