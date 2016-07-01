var pg = require('pg');
var path = require('path');


var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
console.log(connectionString);
client.connect();
var amountOfTablesQuery = client.query("SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public';");
var count = 0;
var num_of_tables = 1;


amountOfTablesQuery.on('end', function(result) {
    num_of_tables = result.rows.length;
    for (var i = 0; i < num_of_tables; i++) {
        row = result.rows[i];
        var query = 'DROP TABLE ' + row.table_name + ';';
        var dropTableQuery = client.query(query);
        dropTableQuery.on('end', function() {
          count++;
          console.log("tabla número: "+ count + " destruida.");
          if(count == num_of_tables){
            console.log('-------------------------------');
            client.end();
          }
        });

    }

});
