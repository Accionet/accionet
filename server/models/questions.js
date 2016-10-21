// server/models/questions.js
'use strict';


const q = require('q');
const base = require('../models/base');

const Options = require('../models/options');

const table_name = 'questions';


// Return all the entries active or not
exports.all = function getAllQuestions(callback) {
    base.all(table_name, callback);
};

// Creates a json representing an empty entry
exports.new = function newQuestion(callback) {
    base.new(table_name, callback);
};

// Creates a json with the attr in attr
function saveQuestionAndOptions(attr, callback) {
    const deferrer = q.defer();
    base.save(attr, table_name, (err, question) => {
        const options = attr.options;

        let saved = 0;

        if (options && options.length && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
                options[i].question_id = question.id;
                Options.save(options[i], (err_opt) => {
                    if (err_opt) {
                        deferrer.reject(err_opt);
                    }
                    saved += 1;
                    if (saved === options.length) {
                        deferrer.resolve(question);
                    }
                });
            }
        } else {
            deferrer.resolve(question);
        }
        deferrer.promise.nodeify(callback);
        return deferrer.promise;
    });
}

exports.save = saveQuestionAndOptions;

function updateQuestion(id, attr, callback) {
    base.update(id, attr, table_name, callback);
}

exports.update = updateQuestion;

exports.updateQuestionsOfSurvey = function (survey, callback) {
    const attr = {
        survey_id: survey.id,
    };

    const newQuestions = survey.questions;

    base.find(attr, table_name, (err, questions) => {
        if (err) {
            return callback(err);
        }

        const questionsToCreate = [];
        const questionsToDelete = [];
        const questionsToUpdate = [];
        // Delete and update the ones that actually exists
        for (let i = 0; i < questions.length; i++) {
            let survives = false;
            for (let j = 0; j < newQuestions.length; j++) {
                if (questions[i].id === newQuestions[j].id) {
                    survives = true;
                    questionsToUpdate.push(newQuestions[j]);
                    break;
                }
            }

            if (!survives) {
                questionsToDelete.push(questions[i]);
            }
        }

        for (let j = 0; j < newQuestions.length; j++) {
            let create = true;
            for (let i = 0; i < questions.length; i++) {
                if (questions[i].id === newQuestions[j].id) {
                    create = false;
                    break;
                }
            }
            if (create) {
                questionsToCreate.push(newQuestions[j]);
            }
        }
        let finishedQueries = 0;

        const totalQueries = questionsToCreate.length + questionsToDelete.length + questionsToUpdate.length;

        for (let i = 0; i < questionsToDelete.length; i++) {
            const question = questionsToDelete[i];
            base.delete(question.id, table_name, (err) => {
                finishedQueries++;
                if (err) {
                    return callback(err);
                }
                if (finishedQueries === totalQueries) {
                    return callback(null, newQuestions);
                }
            });
        }

        for (let i = 0; i < questionsToUpdate.length; i++) {
            const question = questionsToUpdate[i];
            updateQuestion(question.id, question, (err) => {
                finishedQueries++;
                if (err) {
                    return callback(err);
                }
                if (finishedQueries === totalQueries) {
                    return callback(null, newQuestions);
                }
            });
        }

        for (let i = 0; i < questionsToCreate.length; i++) {
            const question = questionsToCreate[i];
            question.survey_id = survey.id;
            saveQuestionAndOptions(question, (err) => {
                finishedQueries++;
                if (err) {
                    return callback(err);
                }
                if (finishedQueries === totalQueries) {
                    return callback(null, newQuestions);
                }
            });
        }


        // // if it doesnt have an update then it has to be deleted
        // if (indexOfUpdate === -1) {
        //     base.delete(questions[i].id, table_name, (err) => {
        //         finishedQueries++;
        //
        //         if (err) {
        //             return callback(err);
        //         }
        //         if (finishedQueries === totalQueries) {
        //             return callback(null, newQuestions);
        //         }
        //     });
        // } else {
        //     base.update(questions[i].id, newQuestions[indexOfUpdate], table_name, (err) => {
        //         finishedQueries++;
        //
        //         if (err) {
        //             return callback(err);
        //         }
        //
        //         if (finishedQueries === totalQueries) {
        //             return callback(null, newQuestions);
        //         }
        //     });
    });
};

exports.findById = function findQuestionById(id, callback) {
    base.findById(id, table_name, callback);
};

exports.findOne = function findFirstQuestion(id, attr, callback) {
    base.findOne(id, attr, table_name, callback);
};

exports.columnNames = function getAttributes(callback) {
    base.columnNames(table_name, callback);
};
