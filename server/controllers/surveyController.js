// server/controllers/surveyController
'use strict';



const path = require('path');
const Surveys = require('../models/surveys');
const excelbuilder = require('msexcel-builder-protobi');
const ExcelGenerator = require('../services/excelGenerator');
const Utils = require('../services/utils');
const Response = require('../models/response');
// const Answer = require('../models/answer');
const httpResponse = require('../services/httpResponse');


exports.index = function getAllSurveys(req, res) {
    const active = true;
    Surveys.find({
        is_active: active,
    }, (err, result) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
                error: `ERROR: ${err}`,
                surveys: [],
                show_active: active,
            });
        }

        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
            surveys: result,
            show_active: active,
        });
    });
};

exports.disabled = function getAllSurveys(req, res) {
    const active = false;
    Surveys.find({
        is_active: active,
    }, (err, result) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
                error: `ERROR: ${err}`,
                surveys: [],
                show_active: active,
            });
        }

        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
            surveys: result,
            show_active: active,
        });
    });
};

exports.count = function countSurveys(req, res) {
    Surveys.count({}, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }

        const json = httpResponse.success('Encuestas contadas exitosamente', 'amount', result);
        return res.status(200).send(json);
    });
};


exports.show = function showSurvey(req, res) {
    Surveys.findById(req.params.id, (err, survey) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
                error: `ERROR: ${err}`,
                survey: [],
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'show.ejs'), {
            survey,
        });
    });
};

exports.edit = function showSurvey(req, res) {
    Surveys.findById(req.params.id, (err, survey) => {
        if (err || !survey) {
            const json = httpResponse.error(err);
            const view_path = httpResponse.errorPath();
            return res.render(view_path, json);
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'edit.ejs'), {
            survey,
        });
    });
};

exports.update = function saveSurvey(req, res) {
    const survey = req.body;
    const url_id = parseInt(req.params.id, 10);
    if (!isNaN(req.params.id) && survey.id === url_id) {
        Surveys.update(survey.id, survey, (err, result) => {
            if (err) {
                const json = httpResponse.error(err);
                return res.status(500).send(json);
            }
            const json = httpResponse.success('Encuesta actualizada exitosamente', 'survey', result);
            return res.status(200).send(json);
        });
    } else {
        const json = httpResponse.error('IDs no coinciden');
        return res.status(500).send(json);
    }
};


exports.create = function saveSurvey(req, res) {
    const survey = req.body;
    Surveys.save(survey, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }

        const json = httpResponse.success('Encuesta guardada exitosamente', 'survey', result);
        return res.status(200).send(json);
    });
};


exports.new = function newSurvey(req, res) {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'new.ejs'), {});
};


exports.metrics = function showMetrics(req, res) {
    Surveys.findById(req.params.id, (err, survey) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
                error: `ERROR: ${err}`,
                survey: [],
                responses: [],
            });
            return;
        }
        Surveys.getMetrics(survey[0].id, (err_find_survey, survey_with_metrics) => {
            // console.log(survey_with_metrics.questions);
            // console.log('-------------------------');
            // console.log(survey_with_metrics.questions[0].metrics);
            if (err_find_survey) {
                res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
                    error: `ERROR: ${err}`,
                    survey: [],
                });
                return;
            }

            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
                survey: survey_with_metrics,
            });
        });
    });
};

/* Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function toggleIsActive(req, res) {
    Surveys.toggleIsActive(req.params.id, (err, response) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(200).send(json);
        }

        const json = httpResponse.success('', 'survey', response);
        return res.status(200).send(json);
    });
};

exports.delete = function deleteEntry(req, res) {
    Surveys.delete(req.params.id, (err, response) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(200).send(json);
        }

        const json = httpResponse.success(`Encuesta ${response.title} eliminada exitosamente`, 'survey', response);
        return res.status(200).send(json);
    });
};


exports.responseSurvey = function (req, res) {
    // It has to have a survey_id and it must be equal to the one in the URL
    const response = JSON.parse(req.body.string_json);
    const url_id = parseInt(req.params.id, 10);
    if (!isNaN(req.params.id) && response.survey_id && response.survey_id === url_id) {
        Response.save(response, (err, result) => {
            if (err) {
                const json = httpResponse.error(err);
                return res.status(400).send(json);
            }
            const json = httpResponse.success('Respuesta enviada con exito', 'response', result);
            return res.status(200).send(json);
        });
    } else {
        // Responder con attributos mal hechos
        const json = httpResponse.error('IDs no coinciden');
        return res.status(400).send(json);
    }
};

// API

exports.metricsByHour = function (req, res) {
    const id = req.params.id;
    Response.metricsByHour({
        survey_id: id,
    }, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }
        const json = httpResponse.success('Metricas por hora enviada con exito', 'data', result);
        return res.status(200).send(json);
    });
};

exports.metricsByDay = function (req, res) {
    const id = req.params.id;
    Response.metricsByDay({
        survey_id: id,
    }, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }
        const json = httpResponse.success('Metricas por dia enviada con exito', 'data', result);
        return res.status(200).send(json);
    });
};

exports.countResponses = function (req, res) {
    const id = req.params.id;
    Response.count({
        survey_id: id,
    }, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }
        const json = httpResponse.success('Cantidad de respuestas enviada con exito', 'data', result);
        return res.status(200).send(json);
    });
};

exports.countEndUser = function (req, res) {
    const id = req.params.id;
    Response.countEndUser({
        survey_id: id,
    }, (err, result) => {
        if (err) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }
        const json = httpResponse.success('Cantidad de usuarios finales enviada con éxito', 'data', result);
        return res.status(200).send(json);
    });
};

exports.generateExcel = function (req, res) {
    const id = req.params.id;
    Response.dataForExcel({
        survey_id: id,
    }, (err, data) => {
        if (err || !data) {
            const json = httpResponse.error(err);
            return res.status(500).send(json);
        }
        // we put the timestamp as file name to secure uniqueness. It could, eventually, fail if two requests arrive at the exact same time
        let filepath = path.join(__dirname, '../', 'uploads');
        const filename = `/${(new Date()).getTime()}.xlsx`;
        const workbook = excelbuilder.createWorkbook(filepath, filename);
        filepath += filename;
        // headers of the excel sheet
        let firstRow;
        try {
            firstRow = Object.keys(data[0]);
        } catch (e) {
            firstRow = [];
        }
        const sheet = {
            name: 'Respuestas',
            firstRow,
            data,
        };
        ExcelGenerator.addSheetToWorkbook(sheet, workbook);
        // Save it
        workbook.save((err) => {
            if (err) {
                throw err;
            } else {
                Utils.sendFile(filepath, `Metricas de Encuesta: ${id}`, 'xlsx', res);
            }
        });
    });
};
