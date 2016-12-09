// server/controllers/visitsController
'use strict';


const Visits = require('../models/visits');
const Metric = require('../models/visits');
const httpResponse = require('../services/httpResponse');
const ExcelGenerator = require('../services/excelGenerator');
const utils = require('../services/utils');
const DayAndHourAdapter = require('../adapters/excelAdapters/dayAndHourAdapter');


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

function getOS(userAgent) {
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  } else if (/android/i.test(userAgent)) {
    return 'Android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { // eslint-disable-line
    return 'iOS';
  }

  // Mac detection
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/Mac/.test(userAgent)) {
    return 'MacOS';
  }
  // CHEck if this is correct
  if (/Win/.test(userAgent)) {
    return 'Windows';
  }

  if (/BlackBerry/.test(userAgent)) {
    return 'BlackBerry';
  }

  if (/Linux/.test(userAgent)) {
    return 'BlackBerry';
  }

  return '';
}

function getBrowser(ua) {
  let tem;

  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return `IE ${(tem[1] || '')}`;
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']; // eslint-disable-line
  tem = ua.match(/version\/(\d+)/i);
  if (tem != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
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
  Metric.byDay({
    place_id: id,
  }).then((daily) => {
    const json = httpResponse.success('Tabla por día', 'data', daily);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.hourlyTable = function (req, res) {
  const id = req.params.id;
  Metric.byHour({
    place_id: id,
  }).then((hourly) => {
    const json = httpResponse.success('Tabla por hora', 'data', hourly);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.dayAndHourTable = function (req, res) {
  const id = req.params.id;
  Metric.tableDateAndHour({
    place_id: id,
  }).then((table) => {
    const json = httpResponse.success('Tabla por hora', 'data', table);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.count = function (req, res) {
  Visits.count().then((data) => {
    const json = httpResponse.success('Visitas totales', 'amount', data);
    return res.status(200).send(json);
  }).catch((err) => {
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
