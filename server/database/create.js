const pg = require('pg');
const path = require('path');


const connectionString = require(path.join(__dirname, '../', '../', 'config'));

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

queries.push(client.query('CREATE TABLE places(id SERIAL PRIMARY KEY,name VARCHAR(80) not null, description VARCHAR(800), is_active BOOLEAN, daily_visits INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100), phone_number INTEGER, status INTEGER)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA places creada');
  closeConnection();
});


queries.push(client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(80) not null UNIQUE, name VARCHAR(80), description VARCHAR(800), is_active BOOLEAN, is_admin BOOLEAN, type INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP, email VARCHAR(100) not null, email_verified BOOLEAN, password VARCHAR(300))'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA users creada');
  closeConnection();
});


// SURVEYS

    // access_type could be read, write and read, owner  (owner is the only one than can delete it?)
queries.push(client.query('CREATE TABLE access(id SERIAL PRIMARY KEY, userid SERIAL references users(id) ON DELETE CASCADE, place_id SERIAL references places(id) ON DELETE CASCADE, access_type varchar(80), created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA access creada');
  closeConnection();
});

queries.push(client.query('CREATE TABLE surveys(id SERIAL PRIMARY KEY, user_id SERIAL references users(id) ON DELETE CASCADE, title VARCHAR(80), description VARCHAR(800), created_at TIMESTAMP, updated_at TIMESTAMP, is_active BOOLEAN)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA surveys creada');
  closeConnection();
});

queries.push(client.query('CREATE TABLE questions(id SERIAL PRIMARY KEY, survey_id INTEGER references surveys(id) ON DELETE CASCADE, title VARCHAR(800), type VARCHAR(120), number INTEGER, created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA questions creada');
  closeConnection();
});

queries.push(client.query('CREATE TABLE options(id SERIAL PRIMARY KEY, question_id SERIAL references questions(id) ON DELETE CASCADE, statement VARCHAR(800), enumeration VARCHAR(4), created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('TABLA options creada');
  closeConnection();
});

// SURVEY ANSWERS


queries.push(client.query('CREATE TABLE response(id SERIAL PRIMARY KEY, survey_id INTEGER references surveys(id) ON DELETE CASCADE, created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', () => {
    // client.end();
  console.log('TABLA response creada');
  closeConnection();
});

queries.push(client.query('CREATE TABLE answer(id SERIAL PRIMARY KEY, response_id INTEGER references response(id) ON DELETE CASCADE, question_id SERIAL references questions(id) ON DELETE CASCADE, answer_text VARCHAR(1800), answer_option_id INTEGER references options ON DELETE CASCADE, created_at TIMESTAMP, updated_at TIMESTAMP)'));
queries[queries.length - 1].on('end', () => {
    // client.end();
  console.log('TABLA answers creada');
  closeConnection();
});
