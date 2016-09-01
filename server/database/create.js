var pg = require('pg');
var path = require('path');


    var connectionString = require(path.join(__dirname, '../', '../', 'config'));

    var client = new pg.Client(connectionString);
    client.connect();
    var ended_queries = 0;

    var queries = [];

    queries.push(client.query('CREATE TABLE places(id SERIAL PRIMARY KEY,name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100), phone_number INTEGER, status INTEGER)'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA places creada");
        closeConnection();
    });


    queries.push(client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(80) not null UNIQUE, name VARCHAR(80), description VARCHAR(800), is_active BOOLEAN, is_admin BOOLEAN, type INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, password VARCHAR(300))'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA users creada");
        closeConnection();
    });


//SURVEYS

    //access_type could be read, write and read, owner  (owner is the only one than can delete it?)
    queries.push(client.query('CREATE TABLE access(id SERIAL PRIMARY KEY, userid SERIAL references users(id), place_id SERIAL references places(id), access_type varchar(80), created_at TIMESTAMP, updated_at TIMESTAMP)'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA access creada");
        closeConnection();
    });

    queries.push(client.query('CREATE TABLE surveys(id SERIAL PRIMARY KEY, user_id SERIAL references users(id), title VARCHAR(80), description VARCHAR(800), created_at TIMESTAMP, updated_at TIMESTAMP)'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA surveys creada");
        closeConnection();
    });

    queries.push(client.query('CREATE TABLE questions(id SERIAL PRIMARY KEY, survey_id SERIAL references surveys(id), title VARCHAR(800), type VARCHAR(120), number INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP)'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA questions creada");
        closeConnection();
    });

    queries.push(client.query('CREATE TABLE options(id SERIAL PRIMARY KEY, question_id SERIAL references questions(id), statement VARCHAR(800), enumeration VARCHAR(4), created_at TIMESTAMP, updated_at TIMESTAMP)'));
    queries[queries.length - 1].on('end', function() {
        // client.end();
        console.log("TABLA options creada");
        closeConnection();
    });

//SURVEY ANSWERS

queries.push(client.query('CREATE TABLE answer(id SERIAL PRIMARY KEY, question_id SERIAL references questions(id), answer_text VARCHAR(1800), answer_option_id INTEGER references questions, created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', function() {
    // client.end();
    console.log("TABLA answers creada");
    closeConnection();
});

queries.push(client.query('CREATE TABLE response(id SERIAL PRIMARY KEY, survey_id SERIAL references surveys(id), created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', function() {
    // client.end();
    console.log("TABLA response creada");
    closeConnection();
});


queries.push(client.query('CREATE TABLE has_answer(id SERIAL PRIMARY KEY, answer_id SERIAL references answer(id), created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', function() {
    // client.end();
    console.log("TABLA response answers creada");
    closeConnection();
});

function closeConnection() {
  ended_queries += 1;
  if(ended_queries >= queries.length){
    client.end();
  }
}
