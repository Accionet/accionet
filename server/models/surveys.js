// server/models/surveys.js

const Answer = require('./answer');

const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');
const base = require('../models/base');

const Questions = require('../models/questions');

const table_name = 'surveys';


// Return all the entries active or not
exports.all = function getSurveys(callback) {
    const deferrer = q.defer();
    const results = [];

    // get the amount of columns in options. This is to leave blank the spaces in the table of those who doesnt have options
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            // SQL Query > Select Data
            const query = client.query("select count(*) as amount from information_schema.columns where table_name='options';");


            let amount = 0;
            query.on('row', (row) => {
                amount = row.amount;
            });
            // Stream results back one row at a time
            // After all data is returned, close connection and return results
            query.on('end', () => {
                const query_string = buildSelectAllQuery(amount);

                const query_all_surveys = client.query(query_string);

                query_all_surveys.on('row', (row) => {
                    extractAndAddSurvey(results, row);
                });
                query_all_surveys.on('end', () => {
                    done();

                    deferrer.resolve(results);
                });
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.count = function countAmountOf(callback) {
    base.count(table_name, callback);
};

function addOptionToQuestion(array, row) {
    let not_present = true;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].questions.length; j++) {
            if (arrayHasElementKey(array[i].questions[j].options, row, 'o_id') >= 0) {
                not_present = false;
                break;
            }
        }
    }


    if (not_present && row.o_id != null) {
        // get the index of the survey
        const s_index = arrayHasElementKey(array, row, 's_id');
        const q_index = arrayHasElementKey(array[s_index].questions, row, 'q_id');
        array[s_index].questions[q_index].options.push(buildOption(row));
    }
}

function addQuestionToSurvey(array, row) {
    let not_present = true;
    for (let i = 0; i < array.length; i++) {
        if (arrayHasElementKey(array[i].questions, row, 'q_id') >= 0) {
            not_present = false;
            break;
        }
    }
    if (not_present && row.q_id != null) {
        // get the index of the survey
        const index = arrayHasElementKey(array, row, 's_id');
        array[index].questions.push(buildQuestion(row));
    }
}

function buildOption(query) {
    const option = {};
    option.id = query.o_id;
    option.enumeration = query.enumeration;
    option.statement = query.statement;
    return option;
}

function buildQuestion(query) {
    const question = {};
    question.id = query.q_id;
    question.title = query.q_title;
    question.number = query.number;
    question.type = query.type;

    question.options = [];

    return question;
}

function buildSurvey(query) {
    const survey = {};
    survey.id = query.s_id;
    survey.user_id = query.user_id;
    survey.title = query.s_title;
    survey.description = query.description;
    survey.created_at = query.created_at;
    survey.updated_at = query.updated_at;
    survey.is_active = query.is_active;
    survey.questions = [];

    return survey;
}

function extractAndAddSurvey(results, row) {
    if (arrayHasElementKey(results, row, 's_id') < 0) {
        const survey = buildSurvey(row);
        results.push(survey);
    }

    addQuestionToSurvey(results, row);

    addOptionToQuestion(results, row);
}


/* Checks if array contains an element with id element[key]*/
function arrayHasElementKey(array, element, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id !== undefined && element[key] !== null && array[i].id === element[key]) {
            return i;
        }
    }
    return -1;
}


/* Builds the query geting the questions and options associated to each survey*/
function buildSelectAllQuery(amount) {
    // include de options UNION the ones without options

    let string = 'SELECT * FROM( ';
    // build the inner query
    string += 'SELECT surveys.id as s_id, questions.id as q_id, options.id as o_id, surveys.title as s_title, questions.title as q_title,  * FROM surveys, questions, options WHERE surveys.id = questions.survey_id AND options.question_id = questions.id ';
    string += ' UNION ';
    string += ' SELECT surveys.id as s_id, questions.id as q_id, null as o_id, surveys.title as s_title, questions.title as q_title, *';

    for (let i = 0; i < amount; i++) {
        string += ', null';
    }
    string += ' FROM surveys, questions WHERE surveys.id = questions.survey_id';

    string += ' ) as pop_surveys ORDER BY s_id, q_id, enumeration;';

    return string;
}


// Creates a json representing an empty entry
exports.new = function newSurvey(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
exports.save = function saveSurvey(attr, callback) {
    const deferrer = q.defer();
    base.save(attr, table_name, (err, survey) => {
        if (err) {
            deferrer.reject(err);
        } else {
            const questions = attr.questions;
            let saved = 0;

            for (let i = 0; i < questions.length; i++) {
                questions[i].survey_id = survey.id;
                Questions.save(questions[i], (err_quest) => {
                    if (err_quest) {
                        deferrer.reject(err_quest);
                    }
                    saved += 1;
                    if (saved === questions.length) {
                        deferrer.resolve(survey);
                    }
                });
            }
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.update = function updateSurvey(id, attr, callback) {
    base.update(id, attr, table_name, callback);
};


exports.toggleIsActive = function toggleIsActive(id, callback) {
    base.toggleIsActive(id, table_name, callback);
};

exports.findById = findSurveyById;

function findSurveyById(id, callback) {
    const deferrer = q.defer();
    const results = [];


    // get the amount of columns in options. This is to leave blank the spaces in the table of those who doesnt have options
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            deferrer.reject(err);
        } else {
            // SQL Query > Select Data
            const query = client.query("select count(*) as amount from information_schema.columns where table_name='options';");


            let amount = 0;
            query.on('row', (row) => {
                amount = row.amount;
            });
            // Stream results back one row at a time
            // After all data is returned, close connection and return results
            query.on('end', () => {
                const query_string = buildSelectByIdQuery(amount);

                const query_get_survey = client.query(query_string, [id]);

                query_get_survey.on('row', (row) => {
                    extractAndAddSurvey(results, row);
                });
                query_get_survey.on('end', () => {
                    done();
                    deferrer.resolve(results);
                });
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
}

/* Builds the query geting the questions and options associated to the survey with id = id*/
function buildSelectByIdQuery(amount) {
    // include de options UNION the ones without options

    let string = 'SELECT * FROM( ';
    // build the inner query
    string += 'SELECT surveys.id as s_id, questions.id as q_id, options.id as o_id, surveys.title as s_title, questions.title as q_title,  * FROM surveys, questions, options WHERE surveys.id = ($1) AND surveys.id = questions.survey_id AND options.question_id = questions.id ';
    string += ' UNION ';
    string += ' SELECT surveys.id as s_id, questions.id as q_id, null as o_id, surveys.title as s_title, questions.title as q_title, *';

    for (let i = 0; i < amount; i++) {
        string += ', null';
    }
    string += ' FROM surveys, questions WHERE surveys.id = ($1) AND surveys.id = questions.survey_id';

    string += ' ) as pop_surveys ORDER BY s_id, q_id, enumeration;';

    return string;
}


exports.getMetrics = function getMetricsOfSurvey(id, callback) {
    const deferrer = q.defer();
    let survey_with_metrics;
    findSurveyById(id, (err, survey) => {
        survey_with_metrics = survey[0];
        let finished = 0;
        for (let i = 0; i < survey[0].questions.length; i++) {
            Answer.getMetrics(survey[0].questions[i], (err_metrics, question_with_metrics) => {
                if (err_metrics) {
                    deferrer.reject(err_metrics);
                } else {
                    console.log(question_with_metrics);
                    finished += 1;
                    if (finished === survey[0].questions.length) {
                        deferrer.resolve(survey_with_metrics);
                    }
                }
            });
        }
    });
    deferrer.promise.nodeify(callback);
    return deferrer.promise;
};

exports.findOne = function findFirst(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
    base.columnNames(table_name, callback);
};


exports.delete = function deleteEntry(id, callback) {
    base.delete(id, table_name, callback);
};
