// server/controllers/visitsController
'use strict';


const Visits = require('../models/visits');
const Place = require('../models/places');

const Metric = require('../models/visits');
const httpResponse = require('../services/httpResponse');
const ExcelGenerator = require('../services/excelGenerator');
const utils = require('../services/utils');
const DayAndHourAdapter = require('../adapters/excelAdapters/dayAndHourAdapter');
const UserAgent = require('ua-parser');


// Functions to do add Parameters to create

function addRequestParams(visit, req) {
  const userAgent = req.headers['user-agent'];
  // add ip

  visit.ip = req.connection.remoteAddress;

  // add os
  // add Browser

  if (userAgent) {
    visit.browser = getBrowser(userAgent);
    visit.os = getOS(userAgent);
  }

  visit.other = userAgent;
}

function getOS(ua) {
  const browser = UserAgent.parse(ua);
  return browser.os.toString();
}

function getBrowser(ua) {
  const browser = UserAgent.parse(ua);
  return browser.ua.toString();
}


//

exports.create = function (req, res) {
  const visit = req.body;
  addRequestParams(visit, req);
  Visits.save(visit).then(() => {
    return res.status(200).send({
      success: 'success',
    });
  }).catch((err) => {
    return res.status(400).send({
      error: err,
    });
  });
};

// ////////////////////////////////////////
// API
// ///////////////////////////////////////

exports.dailyTable = function (req, res) {
  const id = req.params.id;
  Place.findById(id).then((place) => {
    Metric.byDay({
      place_id: id,
    }, place.minutes_offset).then((daily) => {
      const json = httpResponse.success('Tabla por día', 'data', daily);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.hourlyTable = function (req, res) {
  const id = req.params.id;
  Place.findById(id).then((place) => {
    Metric.byHour({
      place_id: id,
    }, place.minutes_offset).then((hourly) => {
      const json = httpResponse.success('Tabla por hora', 'data', hourly);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.dayAndHourTable = function (req, res) {
  const id = req.params.id;
  Place.findById(id).then((place) => {
    Metric.tableDateAndHour({
      place_id: id,
    }, place.minutes_offset).then((table) => {
      const json = httpResponse.success('Tabla por hora', 'data', table);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.count = function (req, res) {
  Visits.countAccessibleBy(req.user.id, true).then((data) => {
    console.log(data);
    const json = httpResponse.success('Visitas totales', 'amount', data);
    return res.status(200).send(json);
  }).catch((err) => {
    console.log(err);
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

/**
This method also return the first date of a visits to count the daily average.
**/
exports.countOfPlace = function (req, res) {
  const id = req.params.id;
  const attr = {
    place_id: id,
  };
  Visits.count(attr).then((data) => {
    Visits.getFirstDate(attr).then((date) => {
      const json = httpResponse.success('Visitas por lugar', ['data', 'date'], [data, date]);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.countEndUsersOfPlace = function (req, res) {
  const id = req.params.id;
  const attr = {
    place_id: id,
  };
  Metric.countEndUsers(attr).then((data) => {
    const json = httpResponse.success('Usuarios finales', ['data'], [data]);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.generateExcel = function (req, res) {
  const attr = {
    place_id: parseInt(req.params.id, 10),
  };
  const promises = [Metric.tableDateAndHour(attr), Visits.find(attr)];
  Promise.all(promises).then((data) => {
    const file = ExcelGenerator.new();
    const workbook = file.workbook;
    const sheet = DayAndHourAdapter.forExcel(data[0], 'día y hora');
    ExcelGenerator.addSheetToWorkbook(sheet, workbook);
    const secondSheet = ExcelGenerator.adaptArrayToSheet(data[1], 'Detalle');
    ExcelGenerator.addSheetToWorkbook(secondSheet, workbook);
    workbook.save((err) => {
      if (err) {
        throw err;
      } else {
        utils.sendFile(file.path, `Metricas de visitas a: ${req.params.id}`, 'xlsx', res);
      }
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};
