// server/models/response.js
'use strict';

const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');
const base = require('../models/base');

const table_name = 'response';

const Answer = require('./answer');


// Return all the entries active or not
exports.all = function allResponses(callback) {
  base.all(table_name, callback);
};

exports.find = function (attr, callback) {
  base.find(attr, table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function newResponse(callback) {
  base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function saveResponse(attr, callback) {
  const deferrer = q.defer();
  base.save(attr, table_name, (err, response) => {
    if (err) {
      deferrer.reject(err);
    } else {
      for (let i = 0; i < attr.answers.length; i++) {
        attr.answers[i].response_id = response.id;
        Answer.save(attr.answers[i], (err_ans) => {
          if (err_ans) {
            deferrer.reject(err_ans);
          }
        });
      }
      deferrer.resolve(response);
    }
  });
  deferrer.promise.nodeify(callback);
  return deferrer.promise;
};

exports.update = function updateResponse(id, attr, callback) {
  base.update(id, attr, table_name, callback);
};

exports.findById = function findResponseById(id, callback) {
  base.findById(id, table_name, callback);
};

exports.findOfSurvey = function getResponsesOfSurvey(id, callback) {
  const deferrer = q.defer();
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      deferrer.reject(err);
    } else {
      const query = client.query(`SELECT * FROM ${table_name} WHERE survey_id = $1`, [id]);

      query.on('row', (row) => {
        results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', () => {
        done();
        deferrer.resolve(results);
      });
    }
  });

  deferrer.promise.nodeify(callback);
  return deferrer.promise;
};

exports.metricsByDay = function (attr, callback) {
  // SELECT date_trunc("day", created_at) AS "day", count(*) FROM response GROUP BY 1 ORDER BY 1;
  // get the params
  const params = base.parseJsonToParams(attr);
  // build the query
  let string_query = "SELECT date_trunc('day', created_at) AS day, count(*) FROM response";
  // Include the attr
  string_query += base.getWhereFromParams(params, true);
  string_query += ' GROUP BY 1 ORDER BY 1;';
  const results = [];

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return callback(err);
    }
    const query = client.query(string_query, params.values);

    query.on('error', (err) => {
      done();
      return callback(err);
    });

    query.on('row', (row) => {
      results.push([new Date(row.day).getTime(), row.count]);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      callback(null, results);
    });
  });
};

exports.metricsByHour = function (attr, callback) {
  // SELECT EXTRACT( hour from foo.day) as hour, avg (c) FROM (SELECT date_trunc('hour', created_at) AS day, count(*) as c FROM response GROUP BY 1 ORDER BY 1) as foo GROUP BY hour ORDER BY hour;
  // SELECT EXTRACT ('hour' FROM created_at) AS hour, count(*) as c FROM response GROUP BY 1 ORDER BY 1
  const params = base.parseJsonToParams(attr);
  // build the query
  let string_query = "SELECT EXTRACT( 'hour' FROM created_at) AS hour, count(*) as c FROM response ";
  // Include the attr
  string_query += base.getWhereFromParams(params, true);
  string_query += ' GROUP BY hour ORDER BY hour';
  const results = [];

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return callback(err);
    }
    const query = client.query(string_query, params.values);

    query.on('error', (err) => {
      done();
      return callback(err);
    });

    query.on('row', (row) => {
      results.push([new Date(null, null, null, row.hour).getTime(), row.c]);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      // fill with missing hours
      for (let h = 0; h < 24; h++) {
        let present = false;
        for (let i = 0; i < results.length; i++) {
          if (new Date(results[i][0]).getHours() === h) {
            present = true;
            break;
          }
        }
        if (!present) {
          results.push([new Date(null, null, null, h).getTime(), 0]);
        }
      }
      results.sort((a, b) => (a[0] - b[0]));
      callback(null, results);
    });
  });
};

exports.count = function (attr, callback) {
  // SELECT COUNT(*) FROM response WHERE survey_id = 2;
  const params = base.parseJsonToParams(attr);
  // build the query
  let string_query = 'SELECT COUNT(*) FROM response ';
  // Include the attr
  string_query += base.getWhereFromParams(params, true);
  let result;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return callback(err);
    }
    const query = client.query(string_query, params.values);

    query.on('error', (err) => {
      done();
      return callback(err);
    });

    query.on('row', (row) => {
      result = row.count;
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      callback(null, result);
    });
  });
};

exports.countEndUser = function (attr, callback) {
  // SELECT COUNT(*) FROM (SELECT DISTINCT macaddress FROM response WHERE survey_id = 2) AS temp;
  const params = base.parseJsonToParams(attr);
  // build the query
  let string_query = 'SELECT COUNT(*) FROM (SELECT DISTINCT macaddress FROM response ';
  // Include the attr
  string_query += base.getWhereFromParams(params, true);
  string_query += ') AS temp';
  let result;

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      return callback(err);
    }
    const query = client.query(string_query, params.values);

    query.on('error', (err) => {
      done();
      return callback(err);
    });

    query.on('row', (row) => {
      result = row.count;
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();

      callback(null, result);
    });
  });
};

exports.findOne = function findFirst(id, attr, callback) {
  base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
  base.getParamsName(table_name, callback);
};


function buildSelectQueryForExcel(params) {
  // parse the params for this particular query
  for (let i = 0; i < params.keys.length; i++) {
    params.keys[i] = `r.${params.keys[i]}`;
  }
  // SELECT
  let string = 'SELECT r.id as contestacion, r.created_at as "ingresada", r.updated_at as "ultima actualizacion", r.macaddress';
  string += ', q.number as "N. de la pregunta", q.title as "pregunta", o.statement as "respuesta"';
  // FROM
  string += ' FROM response as r, questions as q, options as o, answer as a ';
  // WHERE
  string += ' WHERE ';
  string += ' q.survey_id = r.survey_id ';
  string += ' AND o.question_id = q.id ';
  string += " AND q.type = 'multiple_choice' ";
  string += ' AND a.response_id = r.id ';
  string += ' AND a.answer_option_id = o.id ';
  const whereFromParams = base.getWhereFromParams(params, false);
  if (whereFromParams !== '') {
    string += ' AND ';
    string += whereFromParams;
  }
  // ORDER BY
  string += ' ORDER BY q.number, o.enumeration, "ingresada" ';
  return string;
}

exports.dataForExcel = function (attr, callback) {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      return callback(err);
    }
    const params = base.parseJsonToParams(attr);
    const query_string = buildSelectQueryForExcel(params);
    console.log(query_string);
    const query = client.query(query_string, params.values);

    query.on('error', (err) => (callback(err)));

    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return callback(null, results);
    });
  });
};
