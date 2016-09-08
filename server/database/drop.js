 const pg = require('pg');
 const path = require('path');


 const connectionString = require(path.join(__dirname, '../', '../', 'config'));

 const client = new pg.Client(connectionString);
 client.connect();
 const query = client.query('DROP SCHEMA public CASCADE;');
 query.on('end', () => {
   const query_create = client.query('CREATE SCHEMA public;');
   query_create.on('end', () => {
     client.end();
   });
 });
