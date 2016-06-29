var pg = require('pg');
var path = require('path');


    var connectionString = require(path.join(__dirname, '../', '../', 'config'));

    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query('CREATE TABLE places(id SERIAL PRIMARY KEY, name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, status INTEGER, password VARCHAR(300))');
    query.on('end', function() {
        client.end();
    });
