// server/controllers/visitsController
'use strict';


const Visits = require('../models/visit');
const httpResponse = require('../services/httpResponse');


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
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
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
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
}


//

exports.create = function (req, res) {
  const visit = req.body;
  addRequestParams(visit, req);
  Visits.save(visit, (err) => {
    if (err) {
      return res.status(400).send({
        error: err,
      });
    }

    return res.status(200).send({
      success: 'success',
    });
  });
};

// ////////////////////////////////////////
// API
// ///////////////////////////////////////

exports.dailyTable = function (req, res) {
  const id = req.params.id;
  Visits.amountByDay({
    place_id: id,
  }, (err, daily) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    }
    const json = httpResponse.success('Tabla por día', 'data', daily);
    return res.status(200).send(json);
  });
};

exports.hourlyTable = function (req, res) {
  console.log('hourly');

  const id = req.params.id;
  Visits.amountByHour({
    place_id: id,
  }, (err, hourly) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    }
    const json = httpResponse.success('Tabla por hora', 'data', hourly);
    return res.status(200).send(json);
  });
};

exports.dayAndHourTable = function (req, res) {
  console.log('daily and hour');

  const id = req.params.id;
  Visits.tableDateAndHour({
    place_id: id,
  }, (err, table) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    }

    const json = httpResponse.success('Tabla por hora', 'data', table);
    return res.status(200).send(json);
  });
};

/**
This method also return the first date of a visits to count the daily average.
**/
exports.countOfPlace = function (req, res) {
  console.log('fromaa placee');

  const id = req.params.id;
  const attr = {
    place_id: id,
  };
  Visits.count(attr, (err, data) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    }
    Visits.getFirstDate(attr, (err, date) => {
      if (err) {
        const json = httpResponse.error(err);
        return res.status(400).send(json);
      }
      const json = httpResponse.success('Visitas por lugar', ['data', 'date'], [data, date]);
      return res.status(200).send(json);
    });
  });
};

exports.countEndUsersOfPlace = function (req, res) {
  console.log('enddd users');
  const id = req.params.id;
  const attr = {
    place_id: id,
  };
  Visits.countEndUser(attr, (err, data) => {
    if (err) {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    }
    const json = httpResponse.success('Usuarios finales', ['data'], [data]);
    return res.status(200).send(json);
  });
};
