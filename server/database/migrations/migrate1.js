const pg = require('pg');
const path = require('path');


const connectionString = require(path.join(__dirname, '../', '../', '../', 'config'));

const client = new pg.Client(connectionString);
client.connect();
let ended_queries = 0;

const queries = [];

function closeConnection() {
    ended_queries += 1;
    if (ended_queries >= queries.length) {
        client.end();
    }
}


// NEW TABLES

queries.push(client.query('CREATE TABLE hotspot(id SERIAL PRIMARY KEY,name VARCHAR(200), description VARCHAR(800), is_active BOOLEAN, created_at TIMESTAMP, updated_at TIMESTAMP, survey_id INTEGER references surveys(id))'));
queries[queries.length - 1].on('end', () => {
        // client.end();
    console.log('Tabla hotspot creada');
    closeConnection();
});


queries.push(client.query('CREATE TABLE displayed(id SERIAL PRIMARY KEY, created_at TIMESTAMP, updated_at TIMESTAMP, os VARCHAR(200), browser VARCHAR(200), ip VARCHAR(200), macaddres VARCHAR(200), other VARCHAR(800), place_id INTEGER references places(id) ON DELETE CASCADE, hotspot_id INTEGER references hotspot(id) ON DELETE CASCADE)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
    console.log('Tabla displayed creada');
    closeConnection();
});


// ALTER TABLE

queries.push(client.query('ALTER TABLE places ADD COLUMN hotspot_id INTEGER references hotspot(id)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
    console.log('Se agrego columna hostpot_id a tabla places');
    closeConnection();
});
