// server/controllers/placeController
'use strict';



const path = require('path');
const Places = require('../models/places');
const httpResponse = require('../services/httpResponse');


exports.index = function (req, res) {
  const active = true;
  Places.find({
    is_active: active,
  }, (err, result) => {
    if (err) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
        error: `ERROR: ${err}`,
        places: [],
        show_active: active,
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
      places: result,
      show_active: active,
    });
  });
};

exports.disabled = function (req, res) {
  const active = false;
  Places.find({
    is_active: active,
  }, (err, result) => {
    if (err) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
        error: `ERROR: ${err}`,
        places: [],
        show_active: active,
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
      places: result,
      show_active: active,
    });
  });
};

exports.count = function getAmountOf(req, res) {
  Places.count({}, (err, count) => {
    if (err) {
      return res.status(500).send({
        error: err,
        amount: '?',
      });
    }
    const response = {
      success: 'Amount of places where counted successfully',
      amount: count,
    };
    return res.status(200).send(response);
  });
};


// exports.activePlaces = function getActivePlaces(req, res) {
//
// };

/* Shows the view to create a new place */
exports.new = function getNewPlace(req, res) {
  Places.new((err, result) => {
    if (err) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
        error: `ERROR: ${err}`,
        places: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'create.ejs'), {
      place: result,
    });
  });
};


exports.create = function savePlace(req, res) {
  if (req.body.name && req.body.email) {
    Places.save(req.body, (err, place) => {
      if (err) {
        return res.status(400).send({
          error: err,
        });
      }
      const json = httpResponse.success('Lugar creado exitosamente', 'place', place);
      return res.status(200).send(json);
    });
  } else {
    // Responder con attributos mal hechos
  }
};

/* Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function toggleIsActive(req, res) {
  Places.toggleIsActive(req.params.id, (err, response) => {
    if (err) {
      return res.status(400).send({
        error: err,
      });
    }
    const json = {
      place: response,
    };
    return res.status(200).send(json);
  });
};


exports.metrics = function showMetrics(req, res) {
  Places.findById(req.params.id, (err, place) => {
    if (err || !place) {
      const json = httpResponse.error(err);
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'error.ejs'), json);
    }
    Places.metrics(place.id, (err, metrics) => {
      if (err) {
        const json = httpResponse.error(err);
        return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'error.ejs'), json);
      }
      // const json = httpResponse.success(`Metricas de ${place.id}`, 'metrics', metrics);
      const json = {
        message: `Metricas de ${place.id}`,
        place,
        metrics,
      };
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'metrics.ejs'), json);
    });
  });
};


// /* sets the is_active to true */
// exports.activate = function setIsActiveToTure(req, res) {
//
// };

exports.edit = function editPlace(req, res) {
  Places.findById(req.params.id, (err, place) => {
    if (err || !place) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
        error: `ERROR: ${err}`,
        places: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
      place,
    });
  });
};

exports.show = function showPlace(req, res) {
  Places.findById(req.params.id, (err, place) => {
    if (err || !place) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
        error: `ERROR: ${err}`,
        place: [],

      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
      place,
    });
  });
};

exports.update = function updatePlace(req, res) {
  Places.update(req.params.id, req.body, (err, place) => {
    if (err || !place) {
      return res.status(400).send({
        error: err,
      });
    }
    const json = httpResponse.success(`Cambios a  + ${place.name} agregados exitosamente.`, 'place', place);
    return res.status(200).send(json);
  });
};
