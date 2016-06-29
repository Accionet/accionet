var pg = require('pg');
var path = require('path');


    var connectionString = require(path.join(__dirname, '../', '../', 'config'));

    var client = new pg.Client(connectionString);
    console.log(connectionString);
    client.connect();
    var query = client.query('DROP TABLE places;');
    query.on('end', function() {
        client.end();
    });
