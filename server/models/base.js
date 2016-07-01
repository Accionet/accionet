var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var q = require('q');


//CONSTANTS
var ALL_PARAMS = -1;
var NO_LIMIT = -2;


exports.NO_LIMIT = NO_LIMIT;
exports.ALL_PARAMS = ALL_PARAMS;




//########################################################################
//FIND  ##################################################################
//########################################################################

// order_by: attribute that will be use to order
// order_type: Ascending or descending
// if no order is needed, order_by and order_type should be null
// search_params = { keys: [], values: []}. Params that would be use in search. For example, WHERE id = ($1), name = ($2)
// return_params = []. Params that should be returned. For example, SELECT id, name . If null or ALL_PARAMS it will return all the params: SELECT *
//limit
function find(table_name, return_params, search_params, order_by, order_type, offset, limit, callback) {

    var deferrer = q.defer();
    //c is the counter to prevent sql injection
    var c = 1;
    //base errors
    if (!table_name) {
        console.log('Error en "Base.find". no se registró una nombre para la tabla.');
        deferrer.reject('Error en "Base.find". no se registró una nombre para la tabla.');
    }
    //search_params badly build
    if (search_params && ((search_params.keys && search_params.values && search_params.keys.length !== search_params.values.length) || !search_params.keys || !search_params.values)) {
        console.log('Error en "Base.find". parametros de búsqueda mal ingresados.');
        deferrer.reject('Error en "Base.find". parametros de búsqueda mal ingresados.');
    }

    //offset and limit makse sense
    if (offset < 0 || (limit !== NO_LIMIT && limit < 0)) {
        console.log('Error en "Base.find". parametro offset o limit es negativo.');
        deferrer.reject('Error en "Base.find". parametro offset o limit es negativo.');
    }

    var query_string = "";
    //build the query
    //see what are the return params
    if (!return_params || return_params == ALL_PARAMS) {
        query_string += "SELECT * ";
    } else {
        //FIX
    }

    query_string += " FROM " + table_name + " ";

    if (search_params) {
        query_string += " WHERE ";
        for (var i = 0; i < search_params.keys.length; i++) {
            if (i === 0)
                query_string += " " + search_params.keys[i] + " = $" + c + " ";
            else
                query_string += " AND " + search_params.keys[i] + " = $" + c + " ";
            c++;
        }
    }

    if (order_by) {
        query_string += " ORDER BY " + order_by + " ";
        if (order_type)
            query_string += " " + order_type + " ";
    }

    if (offset)
        query_string += " OFFSET " + offset + " ";

    if (limit && limit !== NO_LIMIT)
        query_string += " LIMIT " + limit + " ";

    console.log(query_string);

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            deferrer.reject(err);
        }
        console.log(query_string);
        //S
        var query;
        if (search_params)
            query = client.query(query_string, search_params.values);
        else {
            query = client.query(query_string);
        }


        // After all data is returned, close connection and return results
        query.on('end', function(result) {
            done();
            response = {
              results: result.rows,
              success: "Busqueda completa."
            };
            deferrer.resolve(response);
        });
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;

}


exports.find = find;

// //Return all the places active or not
// exports.all = function(table_name, order_by, order_type, callback) {
//     var deferrer = q.defer();
//     // var results = [];
//
//
//
//     find(table_name, null, null, order_by, order_type, function(err, response) {
//         if (err)
//             deferrer.reject(err);
//         console.log(response);
//
//     });
//
//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if (err) {
//             done();
//             console.log(err);
//             deferrer.reject(err);
//         }
//
//         // SQL Query > Select Data
//         query_string = "SELECT * FROM " + table_name + " ORDER BY " + order_by + " " + order_type + ";";
//         console.log(query_string);
//         var query = client.query(query_string);
//
//         // // Stream results back one row at a time
//         // query.on('row', function(row) {
//         //     results.push(row);
//         // });
//
//         // After all data is returned, close connection and return results
//         query.on('end', function(result) {
//             console.log(result);
//             done();
//             deferrer.resolve(result.rows);
//         });
//         deferrer.promise.nodeify(callback);
//         return deferrer.promise;
//     });
// };


//########################################################################
//COLUMN NAMES ###########################################################
//########################################################################

function getColumnNamesOfTable(table_name, callback) {
    var deferrer = q.defer();
    columnNames = [];
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        console.log("prequery");

        // SQL Query > Select Data
        var query = client.query("SELECT column_name FROM information_schema.columns WHERE table_name = $1;", [table_name]);


        // Stream results back one row at a time
        query.on('row', function(row) {
            console.log('por pushiar');
            columnNames.push(row.column_name);
            console.log(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            deferrer.resolve(columnNames);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}


exports.columnNames = getColumnNamesOfTable;





//Recieves an array, goes through it and checks if it has the value 'id'
function removeIdColumn(array) {
    var index = array.indexOf('id');
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}




//########################################################################
//NEW - SAVE  ############################################################
//########################################################################

//Creates a json representing an empty entry of table_name
exports.new = function(table_name, callback) {

    var deferrer = q.defer();
    console.log('------------------------------new-----------------------------');
    getColumnNamesOfTable(table_name, function(err, columnNames) {
        if (err) {
            deferrer.reject(err);
        }
        console.log(columnNames);
        var newEntry = {};
        for (var i = 0; i < columnNames.length; i++) {
            newEntry[columnNames[i]] = null;
        }
        console.log(newEntry);
        deferrer.resolve(newEntry);
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};

//Creates a json with the attr in attr
exports.save = function(params, table_name, callback) {

    var deferrer = q.defer();

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        query_string = buildInsertIntoQuery(params, table_name);
        var query = client.query(query_string, params.values);
        //    var query  = client.query("INSERT INTO places values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", values);



        // After all data is returned, close connection and return results
        query.on('end', function(query_response) {
            done();
            save_response = {
                entry: query_response.rows[0],
                success: (params.values.name + " agregado exitósamente.")
            };
            console.log(save_response);
            deferrer.resolve(save_response);
        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });


};

//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildInsertIntoQuery(params, table_name) {

    console.log('buildInsertIntoQuery');
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

    query += ");";

    console.log(query);
    return query;
}


//########################################################################
//UPDATE  ################################################################
//########################################################################


exports.update = function(id, params, table_name, callback) {
    var deferrer = q.defer();

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        }

        var query_string = buildUpdateQuery(id, table_name, params);

        params.values.push(id);
        var query = client.query(query_string, params.values);


        // After all data is returned, close connection and return results
        query.on('end', function(results) {
            done();
            console.log(results);
            //Equivalent to findById
            search_params = {
                keys: ['id'],
                values: [id]
            };
            find(table_name, null, search_params, null, null, 0, 1, function (err, response) {
              if (err) {
                  done();
                  deferrer.reject(err);
              }
              update_response = {
                  entry: response.results[0],
                  success: (response.results[0].name + " modificado exitósamente.")
              };
              console.log(update_response);
              deferrer.resolve(update_response);
            });


            // });

        });
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
};

//params has to be a json containing two arrays, keys and values. It should look like these params = { keys: [], values: []}
function buildUpdateQuery(id, table_name, params) {
    console.log('--------------------buildUpdateQuery------------------------');
    query = "UPDATE " + table_name + " SET";
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
