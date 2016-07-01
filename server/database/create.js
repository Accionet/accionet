var pg = require('pg');
var path = require('path');


var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

var queries = [];
var numOfFinishedQueries = 0;
var createTablePlaces = client.query('CREATE TABLE places(id SERIAL PRIMARY KEY, name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, status INTEGER, password VARCHAR(300))');
addQueryTo(queries, createTablePlaces);
var createTableUser = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, firstName VARCHAR(80), lastName VARCHAR(80), description VARCHAR(800), is_active BOOLEAN, email VARCHAR(160) not null, is_super_user BOOLEAN, place INTEGER, brand INTEGER);');
addQueryTo(queries, createTableUser);


function addQueryTo(queries, query) {
    queries.push(query);
    query.on('end', function() {
        numOfFinishedQueries++;
        if (numOfFinishedQueries >= queries.length)
            client.end();
    });


}
