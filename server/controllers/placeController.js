// server/controllers/placeController
'use strict';



const path = require('path');
const Places = require('../models/places');
const httpResponse = require('../services/httpResponse');
const TimeZone = require('./timeZoneController');


function all(req, res, active) {
  Places.find({
    is_active: active,
  }).then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
      places: result,
      show_active: active,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
      error: `ERROR: ${err}`,
      places: [],
      show_active: active,
    });
  });
}

exports.index = function (req, res) {
  return all(req, res, true);
};

exports.disabled = function (req, res) {
  return all(req, res, false);
};

exports.onlyNamesAndId = function (req, res) {
  const active = true;
  const columns = { places: ['id', 'name'] };
  Places.find({ is_active: active }, columns).then((result) => {
    const json = httpResponse.success('nombres enviados exitosamente', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(500).send(json);
    }
  });
};

exports.count = function getAmountOf(req, res) {
  Places.count({}).then((count) => {
    const response = {
      success: 'Amount of places where counted successfully',
      amount: count,
    };
    return res.status(200).send(response);
  }).catch((err) => {
    return res.status(500).send({
      error: err,
      amount: '?',
    });
  });
};


/* Shows the view to create a new place */
exports.new = function getNewPlace(req, res) {
  Places.new().then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'create.ejs'), {
      place: result,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'create.ejs'), {
      error: `ERROR: ${err}`,
      place: [],
    });
  });
};


exports.create = function savePlace(req, res) {
  if (req.body.name && req.body.email && req.body.location) {
    TimeZone.getMinutesOffset(req.body.location).then((minutes_offset) => {
      req.body.minutes_offset = minutes_offset;
      Places.save(req.body).then((place) => {
        const json = httpResponse.success('Lugar creado exitosamente', 'place', place);
        return res.status(200).send(json);
      }).catch((err) => {
        return res.status(400).send({
          error: err,
        });
      });
    }).catch(() => {
      return res.status(400).send({
        error: 'Zona horaria mal indicada',
      });
    });
  } else {
    return res.status(400).send({
      error: 'missing name and/or email',
    });
  }
};

/* Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function toggleIsActive(req, res) {
  Places.toggleIsActive(req.params.id).then((response) => {
    const json = {
      place: response,
    };
    return res.status(200).send(json);
  }).catch((err) => {
    return res.status(400).send({
      error: err,
    });
  });
};


exports.metrics = function showMetrics(req, res) {
  let json = {
    error: `Metricas de ${req.params.id} no se encuentran disponible`,
    place: [],
    metrics: [],
  };
  Places.findById(req.params.id).then((place) => {
    if (!place) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'metrics.ejs'), json);
    }
    Places.metrics(place.id, place.minutes_offset).then((metrics) => {
      json = {
        message: `Metricas de ${place.id}`,
        place,
        metrics,
      };
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'metrics.ejs'), json);
    }).catch((err) => {
      if (err) {
        return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'metrics.ejs'), json);
      }
    });
  }).catch(() => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'metrics.ejs'), json);
  });
};


// /* sets the is_active to true */
// exports.activate = function setIsActiveToTure(req, res) {
//
// };

exports.edit = function editPlace(req, res) {
  Places.findById(req.params.id).then((place) => {
    if (!place) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
        error: 'ERROR: No place found',
        place: [],
      });
    }
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
      place,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
      error: `ERROR: ${err}`,
      place: [],
    });
  });
};

exports.show = function showPlace(req, res) {
  Places.findById(req.params.id).then((place) => {
    if (!place) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
        error: 'ERROR: No place found',
        place: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
      place,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
      error: `ERROR: ${err}`,
      place: [],
    });
  });
};

exports.update = function updatePlace(req, res) {
  const id = parseInt(req.params.id, 10);
  Places.update(id, req.body).then((place) => {
    if (!place) {
      return res.status(400).send({
        error: 'No place found',
      });
    }
    const json = httpResponse.success(`Cambios a  + ${place.name} agregados exitosamente.`, 'place', place);
    return res.status(200).send(json);
  }).catch((err) => {
    return res.status(400).send({
      error: err,
    });
  });
};
