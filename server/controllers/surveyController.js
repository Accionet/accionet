// server/controllers/surveyController
'use strict';



const path = require('path');
const Surveys = require('../models/surveys');
const excelbuilder = require('msexcel-builder-protobi');
const ExcelGenerator = require('../services/excelGenerator');
const Utils = require('../services/utils');
const Response = require('../models/responses');
// const Answer = require('../models/answer');
const httpResponse = require('../services/httpResponse');
const debug = require('debug')('Survey Controller');


exports.index = function getAllSurveys(req, res) {
  const active = true;
  Surveys.find({
    is_active: active,
  }).then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
      surveys: result,
      show_active: active,
    });
  }).catch((err) => {
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
        error: `ERROR: ${err}`,
        surveys: [],
        show_active: active,
      });
    }
  });
};

exports.disabled = function getAllSurveys(req, res) {
  const active = false;
  Surveys.find({
    is_active: active,
  }).then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
      surveys: result,
      show_active: active,
    });
  }).catch((err) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
      error: `ERROR: ${err}`,
      surveys: [],
      show_active: active,
    });
  });
};

exports.count = function countSurveys(req, res) {
  Surveys.count({}).then((result) => {
    const json = httpResponse.success('Encuestas contadas exitosamente', 'amount', result);
    return res.status(200).send(json);
  }).catch((err) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(500).send(json);
    }
  });
};


exports.show = function showSurvey(req, res) {
  Surveys.findById(req.params.id).then((survey) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'show.ejs'), {
      survey,
    });
  }).catch((err) => {
    debug(err);
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'show.ejs'), {
        error: `ERROR: ${err}`,
        survey: [],
      });
    }
  });
};

exports.edit = function showSurvey(req, res) {
  Surveys.findById(req.params.id).then((survey) => {
    if (!survey) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'edit.ejs'), {
        error: `No se encontró un survey con id: ${req.params.id}`,
        survey: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'edit.ejs'), {
      survey,
    });
  }).catch((err) => {
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'edit.ejs'), {
        error: `ERROR: ${err}`,
        survey: [],
      });
    }
  });
};

exports.update = function saveSurvey(req, res) {
  const survey = req.body;
  const url_id = parseInt(req.params.id, 10);
  if (!isNaN(req.params.id) && survey.id === url_id) {
    Surveys.update(survey.id, survey).then((result) => {
      const json = httpResponse.success('Encuesta actualizada exitosamente', 'survey', result);
      return res.status(200).send(json);
    }).catch((err) => {
      if (err) {
        debug(err);
        const json = httpResponse.error(err);
        return res.status(500).send(json);
      }
    });
  } else {
    const json = httpResponse.error('IDs no coinciden');
    return res.status(500).send(json);
  }
};


exports.create = function saveSurvey(req, res) {
  const survey = req.body;
  console.log(survey);
  Surveys.save(survey).then((result) => {
    const json = httpResponse.success('Encuesta guardada exitosamente', 'survey', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};


exports.new = function newSurvey(req, res) {
  res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'new.ejs'), {});
};


exports.metrics = function showMetrics(req, res) {
  Surveys.findById(req.params.id).then((survey) => {
    Surveys.getMetrics(survey.id).then((survey_with_metrics) => {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
        survey: survey_with_metrics,
      });
    }).catch((err) => {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
        error: `ERROR: ${err}`,
        survey: [],
      });
    });
  }).catch((err) => {
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
        error: `ERROR: ${err}`,
        survey: [],
        responses: [],
      });
      return;
    }
  });
};

/* Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function toggleIsActive(req, res) {
  Surveys.toggleIsActive(req.params.id).then((response) => {
    const json = httpResponse.success('', 'survey', response);
    return res.status(200).send(json);
  }).catch((err) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(200).send(json);
    }
  });
};

exports.delete = function deleteEntry(req, res) {
  Surveys.delete(req.params.id).then((response) => {
    const json = httpResponse.success(`Encuesta ${response.title} eliminada exitosamente`, 'survey', response);
    return res.status(200).send(json);
  }).catch((err) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(200).send(json);
    }
  });
};


exports.responseSurvey = function (req, res) {
  // It has to have a survey_id and it must be equal to the one in the URL
  const response = JSON.parse(req.body.string_json);
  const url_id = parseInt(req.params.id, 10);
  if (!isNaN(req.params.id) && response.survey_id && response.survey_id === url_id) {
    Response.save(response).then((result) => {
      const json = httpResponse.success('Respuesta enviada con exito', 'response', result);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
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
  Response.byHour({
    survey_id: id,
  }).then((result) => {
    const json = httpResponse.success('Metricas por hora enviada con exito', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};

exports.metricsByDay = function (req, res) {
  const id = req.params.id;
  Response.byDay({
    survey_id: id,
  }).then((result) => {
    const json = httpResponse.success('Metricas por dia enviada con exito', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};

exports.countResponses = function (req, res) {
  const id = req.params.id;
  Response.count({
    survey_id: id,
  }).then((result) => {
    const json = httpResponse.success('Cantidad de respuestas enviada con exito', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};

exports.countEndUser = function (req, res) {
  const id = req.params.id;
  Response.countEndUsers({
    survey_id: id,
  }).then((result) => {
    const json = httpResponse.success('Cantidad de usuarios finales enviada con éxito', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};

exports.generateExcel = function (req, res) {
  const id = req.params.id;
  Response.dataForExcel({
    survey_id: id,
  }).then((data) => {
    if (!data) {
      const json = httpResponse.error('No data');
      return res.status(500).send(json);
    }
    // we put the timestamp as file name to secure uniqueness. It could, eventually, fail if two requests arrive at the exact same time
    let filepath = path.join(__dirname, '../', 'uploads');
    const filename = `/${(new Date()).getTime()}.xlsx`;
    const workbook = excelbuilder.createWorkbook(filepath, filename);
    filepath += filename;
    const sheet = ExcelGenerator.adaptArrayToSheet(data, 'Respuestas');
    ExcelGenerator.addSheetToWorkbook(sheet, workbook);
    // Save it
    workbook.save((err) => {
      if (err) {
        throw err;
      } else {
        Utils.sendFile(filepath, `Metricas de Encuesta: ${id}`, 'xlsx', res);
      }
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(500).send(json);
  });
};
