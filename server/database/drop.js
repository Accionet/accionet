var pg = require('pg');
var path = require('path');


var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
console.log(connectionString);
client.connect();
var query = client.query('DROP SCHEMA public CASCADE;');
query.on('end', function() {
  var query = client.query('CREATE SCHEMA public;');
  query.on('end', function() {
      client.end();
  });
});
