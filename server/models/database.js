var pg = require('pg');
var path = require('path');
var express = require('express');
var app = express();

if (app.get('env') == "development") {
    var connectionString = require(path.join(__dirname, '../', '../', 'config'));

    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query('CREATE TABLE places(id SERIAL PRIMARY KEY, name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, status INTEGER, password VARCHAR(300))');
    query.on('end', function() {
        client.end();
    });
}
else {
  pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    //.query('SELECT table_schema,table_name FROM information_schema.tables;')
    .query('CREATE TABLE places(id SERIAL PRIMARY KEY, name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, status INTEGER, password VARCHAR(300))')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
}
