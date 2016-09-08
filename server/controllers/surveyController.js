// server/controllers/surveyController


const path = require('path');
const Surveys = require('../models/surveys');

const Response = require('../models/response');
const Answer = require('../models/answer');


exports.index = function getAllSurveys(req, res) {
  Surveys.all((err, result) => {
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
        error: `ERROR: ${err}`,
        surveys: [],
      });
    }

    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'index.ejs'), {
      surveys: result,
    });
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
    Answer.findOfSurvey(req.params.id, (errFindSurvey, responses) => {
      if (errFindSurvey) {
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
          error: `ERROR: ${err}`,
          survey: [],
          responses: [],
        });
        return;
      }
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'metrics.ejs'), {
        survey,
        responses,
      });
    });
  });
};


exports.responseSurvey = function respondSurvey(req, res) {
    // It has to have a survey_id and it must be equal to the one in the URL

  const response = JSON.parse(req.body.string_json);
    // console.log(req);
  if (response.survey_id && response.survey_id === req.params.id) {
    Response.save(response, (err, result) => {
      if (err) {
        return res.status(400).send({
          error: err,
        });
      }
      return res.status(200).send({
        success: 'enviada con exito',
      });
    });
  } else {
        // Responder con attributos mal hechos
    return res.status(400).send({
      error: 'ID no válido',
    });
  }
};
