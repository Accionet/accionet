// server/models/surveys.js
'use strict';


const Answer = require('./answer');

const path = require('path');
const pg = require('pg');

const connectionString = require(path.join(__dirname, '../', '../', 'config'));
const q = require('q');
const base = require('../models/base');

const Questions = require('../models/questions');

const table_name = 'surveys';


function find(attr, callback) {
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

            query.on('error', (err) => (deferrer.reject(err)));

            query.on('row', (row) => {
                amount = row.amount;
            });
            // Stream results back one row at a time
            // After all data is returned, close connection and return results
            query.on('end', () => {
                const query_string = buildSelectQuery(attr, amount);

                const params = base.parseJsonToParams(attr);
                const query_all_surveys = client.query(query_string, params.values);

                query_all_surveys.on('error', (err) => (deferrer.reject(err)));

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
}


// Return all the entries active or not
exports.all = function (callback) {
    find(null, callback);
};

exports.find = find;

exports.count = function countAmountOf(attr, callback) {
    base.count(attr, table_name, callback);
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
    survey.count_responses = 0;

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
    base.update(id, attr, table_name, (err, survey) => {
        if (err || !survey) {
            return callback(err);
        }
        Questions.updateQuestionsOfSurvey(attr, (err, questions) => {
            if (err) {
                return callback(err);
            }
            survey.questions = questions;
            return callback(null, survey);
        });
    });
};


exports.toggleIsActive = function toggleIsActive(id, callback) {
    base.toggleIsActive(id, table_name, callback);
};

exports.findById = function (id, callback) {
    const attr = {
        id,
    };
    find(attr, callback);
};


function buildSelectQuery(json, amount) {
    const params = base.parseJsonToParams(json);

    // include de options UNION the ones without options

    let string = 'SELECT * FROM( ';
    // build the inner query
    string += 'SELECT surveys.id as s_id, questions.id as q_id, options.id as o_id, surveys.title as s_title, questions.title as q_title,  * FROM surveys, questions, options ';
    string += ' WHERE ';
    for (let j = 0; j < params.keys.length; j++) {
        string += `surveys.${params.keys[j]} = ($${j + 1}) AND`;
    }
    string += ' surveys.id = questions.survey_id AND options.question_id = questions.id ';
    string += ' UNION ';
    string += ' SELECT surveys.id as s_id, questions.id as q_id, null as o_id, surveys.title as s_title, questions.title as q_title, *';

    for (let i = 0; i < amount; i++) {
        string += ', null';
    }

    string += ' FROM surveys, questions  WHERE  ';
    for (let j = 0; j < params.keys.length; j++) {
        string += `surveys.${params.keys[j]} = ($${j + 1}) AND`;
    }
    string += ' surveys.id = questions.survey_id ';
    string += ' ) as pop_surveys ORDER BY s_id, q_id, enumeration;';
    return string;
}


exports.getMetrics = function getMetricsOfSurvey(id, callback) {
    const deferrer = q.defer();
    let survey_with_metrics;
    const attr = {
        id,
    };
    find(attr, (err, survey) => {
        survey_with_metrics = survey[0];
        let finished = 0;
        for (let i = 0; i < survey[0].questions.length; i++) {
            const question = survey[0].questions[i];


            Answer.getMetrics(question, (err_metrics) => {
                if (err_metrics) {
                    deferrer.reject(err_metrics);
                } else {
                    finished += 1;
                    if (finished === survey[0].questions.length) {
                        deferrer.resolve(survey_with_metrics);
                    }
                }
            });
        }
    });

    //     SELECT * FROM(
    // SELECT surveys.id as s_id, response.id as r_id, questions.id as q_id, questions.number as q_number, options.statement as o_statement, options.enumeration as o_enumeration,  answer_text, answer_option_id as o_id, questions.type as type
    // FROM response, answer, surveys, questions, options
    // WHERE response.id = answer.response_id
    // AND answer.question_id = questions.id
    // AND answer.answer_option_id = options.id
    // AND options.question_id = questions.id
    // AND questions.survey_id = surveys.id
    // AND response.survey_id = surveys.id
    // AND questions.type = 'multiple_choice'
    // UNION
    // SELECT surveys.id as s_id, response.id as r_id, questions.id as q_id, questions.number as q_number, null as o_statement, null as o_enumeration,  answer_text, null as o_id, questions.type as type
    // FROM response, answer, surveys, questions
    // WHERE response.id = answer.response_id
    // AND answer.question_id = questions.id
    // AND questions.survey_id = surveys.id
    // AND response.survey_id = surveys.id
    // AND questions.type = 'written_answer'
    // ) as pop_responses
    // GROUP BY s_id, r_id, q_number, o_enumeration, o_statement, answer_text, q_id, o_id, type
    // ORDER BY s_id, r_id, q_id, o_statement;
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
