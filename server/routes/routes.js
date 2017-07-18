'use strict';

// const express = require('express');
const path = require('path');
const aws = require('aws-sdk');
// eslint-disable-next-line new-cap

// var passport = require('passport');
// controllers
const placeController = require('../controllers/placeController');
const responseController = require('../controllers/responseController');
const userController = require('../controllers/userController');
const surveyController = require('../controllers/surveyController');
const dashboardController = require('../controllers/dashboardController');
const visitController = require('../controllers/visitController');
const accessController = require('../controllers/accessController');
const hotspotController = require('../controllers/hotspotController');


// models
const User = require('../models/users');
const Access = require('../models/access');


module.exports = function router(app, passport, S3_BUCKET) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use((req, res, next) => {
    res.locals.user = req.user;
    // console.log(req.url);
    // console.log(req.user);
    next();
  });

  /* GET  page. */
  app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'login.ejs'), {
      message: req.flash('loginMessage'),
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


  /* GET home page. */
  app.get('/dashboard', isLoggedIn, (req, res, next) => {
    dashboardController.show(req, res, next);
    // res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
  });

  // ////////////////////////////////////////////
  // /////////// PLACES ////////////////////////
  // //////////////////////////////////////////


  app.get('/places', isLoggedIn, (req, res, next) => {
    placeController.index(req, res, next);
  });

  app.get('/places/disabled', isAdmin, (req, res, next) => {
    placeController.disabled(req, res, next);
  });

  app.get('/places/count', isLoggedIn, (req, res, next) => {
    placeController.count(req, res, next);
  });

  app.get('/places/:id/edit', hasAccessToWrite, (req, res, next) => {
    placeController.edit(req, res, next);
  });


  app.get('/places/new', isAdmin, (req, res, next) => {
    placeController.new(req, res, next);
  });

  app.get('/places/:id', hasAccessToRead, (req, res, next) => {
    placeController.show(req, res, next);
  });

  app.post('/places/new', isAdmin, (req, res, next) => {
    placeController.create(req, res, next);
  });

  app.put('/places/:id/edit', hasAccessToWrite, (req, res, next) => {
    placeController.update(req, res, next);
  });

  app.put('/places/:id/toggleIsActive', hasAccessToWrite, (req, res, next) => {
    placeController.toggleIsActive(req, res, next);
  });

  app.get('/places/:id/metrics', hasAccessToRead, (req, res, next) => {
    placeController.metrics(req, res, next);
  });


  // ////////////////////////////////////////////
  // /////////// SURVEY ////////////////////////
  // //////////////////////////////////////////


  app.get('/surveys', isLoggedIn, (req, res, next) => {
    surveyController.index(req, res, next);
  });

  app.get('/surveys/disabled', isAdmin, (req, res, next) => {
    surveyController.disabled(req, res, next);
  });


  app.get('/surveys/new', isAdmin, (req, res, next) => {
    surveyController.new(req, res, next);
  });

  app.post('/surveys/new', isAdmin, (req, res, next) => {
    surveyController.create(req, res, next);
  });

  app.get('/surveys/count', isLoggedIn, (req, res, next) => {
    surveyController.count(req, res, next);
  });

  app.get('/surveys/:id', hasAccessToRead, (req, res, next) => {
    surveyController.show(req, res, next);
  });

  app.get('/surveys/:id/edit', hasAccessToWrite, (req, res, next) => {
    surveyController.edit(req, res, next);
  });

  app.get('/surveys/:id/metrics', hasAccessToRead, (req, res, next) => {
    surveyController.metrics(req, res, next);
  });

  app.get('/surveys/:id/excel', hasAccessToRead, (req, res, next) => {
    surveyController.generateExcel(req, res, next);
  });

  app.post('/survey/:id/response', (req, res, next) => {
    surveyController.responseSurvey(req, res, next);
  });

  app.put('/surveys/:id/toggleIsActive', hasAccessToWrite, (req, res, next) => {
    surveyController.toggleIsActive(req, res, next);
  });

  app.put('/surveys/:id/update', hasAccessToWrite, (req, res, next) => {
    surveyController.update(req, res, next);
  });

  app.delete('/surveys/:id/delete', hasAccessToWrite, (req, res, next) => {
    surveyController.delete(req, res, next);
  });


  app.get('/responses/count', isLoggedIn, (req, res, next) => {
    responseController.count(req, res, next);
  });


  // API

  app.get('/api/v1/surveys/:id/metrics/responses/byhour', hasAccessToRead, (req, res, next) => {
    surveyController.metricsByHour(req, res, next);
  });

  app.get('/api/v1/surveys/:id/metrics/responses/byday', hasAccessToRead, (req, res, next) => {
    surveyController.metricsByDay(req, res, next);
  });

  app.get('/api/v1/surveys/:id/metrics/responses/count', hasAccessToRead, (req, res, next) => {
    surveyController.countResponses(req, res, next);
  });

  app.get('/api/v1/surveys/:id/metrics/enduser/count', hasAccessToRead, (req, res, next) => {
    surveyController.countEndUser(req, res, next);
  });

  app.get('/api/v1/surveys/all/names', isLoggedIn, (req, res, next) => {
    surveyController.onlyNamesAndId(req, res, next);
  });


  // //////////////////////////////////////////
  // ///////// Visits  ////////////////////
  // ////////////////////////////////////////

  app.post('/visits/new', (req, res, next) => {
    visitController.create(req, res, next);
  });

  app.get('/visits/count', isLoggedIn, (req, res, next) => {
    visitController.count(req, res, next);
  });

  app.get('/api/v1/places/:id/metrics/visits/daily', hasAccessToRead, (req, res, next) => {
    visitController.dailyTable(req, res, next);
  });

  app.get('/api/v1/places/:id/metrics/visits/hourly', hasAccessToRead, (req, res, next) => {
    visitController.hourlyTable(req, res, next);
  });

  app.get('/api/v1/places/:id/metrics/visits/dayandhour', hasAccessToRead, (req, res, next) => {
    visitController.dayAndHourTable(req, res, next);
  });

  app.get('/api/v1/places/:id/metrics/visits/count', hasAccessToRead, (req, res, next) => {
    visitController.countOfPlace(req, res, next);
  });

  app.get('/api/v1/surveys/:id/metrics/visits/count', hasAccessToRead, (req, res, next) => {
    visitController.countOfSurvey(req, res, next);
  });

  app.get('/api/v1/places/:id/metrics/endusers/count', hasAccessToRead, (req, res, next) => {
    visitController.countEndUsersOfPlace(req, res, next);
  });

  app.get('/api/v1/places/all/names', isLoggedIn, (req, res, next) => {
    placeController.onlyNamesAndId(req, res, next);
  });


  // //////////////////////////////////////////
  // ///////// USERS  ////////////////////////
  // ////////////////////////////////////////

  app.get('/users/count', isLoggedIn, (req, res, next) => {
    userController.count(req, res, next);
  });

  app.get('/users', isAdmin, (req, res, next) => {
    userController.index(req, res, next);
  });

  app.get('/users/disabled', isAdmin, (req, res, next) => {
    userController.disabled(req, res, next);
  });

  app.get('/users/new', isAdmin, (req, res, next) => {
    userController.new(req, res, next);
  });

  app.get('/users/:id', hasAccessToRead, (req, res, next) => {
    userController.show(req, res, next);
  });

  app.get('/users/:id/edit', hasAccessToWrite, (req, res, next) => {
    userController.edit(req, res, next);
  });

  app.put('/users/:id/edit', hasAccessToWrite, (req, res, next) => {
    userController.update(req, res, next);
  });

  app.put('/users/:id/toggleIsActive', hasAccessToWrite, (req, res, next) => {
    userController.toggleIsActive(req, res, next);
  });

  app.get('/users/isunique/:username', isAdmin, (req, res, next) => {
    userController.isUnique(req, res, next);
  });

  app.get('/users/:id/access', hasAccessToRead, (req, res, next) => {
    accessController.fromUser(req, res, next);
  });

  app.put('/users/:id/access', hasAccessToWrite, (req, res, next) => {
    accessController.editFromUser(req, res, next);
  });

  app.get('/profile', isLoggedIn, (req, res, next) => {
    userController.profile(req, res, next);
  });

  // process the signup form
  app.post('/users/new', isAdmin, (req, res, next) => {
    userController.create(req, res, next);
  });


  // //////////////////////////////////////////
  // ///////// hotspots  ////////////////////////
  // ////////////////////////////////////////

  app.get('/hotspots', isLoggedIn, (req, res, next) => {
    hotspotController.index(req, res, next);
  });

  app.get('/hotspots/disabled', isAdmin, (req, res, next) => {
    hotspotController.disabled(req, res, next);
  });

  app.get('/hotspots/new', isAdmin, (req, res) => {
    hotspotController.new(req, res);
  });

  app.get('/hotspots/new/debug', isLoggedIn, (req, res) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'hotspots', 'new_backup.ejs'), {});
  });

  app.get('/hotspots/template/:template', isLoggedIn, (req, res, next) => {
    hotspotController.getHotspot(req, res, next);
  });

  app.post('/hotspots/save/', isLoggedIn, (req, res, next) => {
    hotspotController.save(req, res, next);
  });

  app.get('/hotspots/:id', (req, res, next) => {
    hotspotController.get(req, res, next);
  });


  // ///////////////////// API ////////////////////////////


  app.get('/api/v1/hotspots/:id/metrics/visits/count', hasAccessToRead, (req, res, next) => {
    req.params.key = 'hotspot_id';
    visitController.countOf(req, res, next);
  });

  // S3 debug
  app.get('/account', (req, res) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'uploadtos3test', 'account.ejs'), {});
  });

  app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });
};
//
// ////////////////////////////////////////////
// /////////// CHECK LOGIN  //////////////////
// //////////////////////////////////////////
//
//
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  logout(req, res);
}

function selfUser(req) {
  if (!(req.user && req.params.id)) {
    return false;
  }
  // turn then to strings to avoid returning false when one is 1 and the other "1"
  return req.user.id.toString() === req.params.id.toString();
}

function hasAccessToWrite(req, res, next) {
  if (selfUser(req)) {
    return next();
  }
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    const access = { in: extractTableFromUrl(req.url),
      to: req.params.id,
      user_id: req.user.id,
    };
    const promises = [];
    promises.push(User.isAdmin(access.user_id));
    promises.push(Access.hasWriteAccess(access.user_id, access.to, access.in));
    Promise.all(promises).then((results) => {
      if (results[0] || results[1]) {
        return next();
      }
      logout(req, res);
    }).catch(() => {
      logout(req, res);
    });
  } else {
    // if they aren't redirect them to the home page
    logout(req, res);
  }
}

function hasAccessToRead(req, res, next) {
  if (selfUser(req)) {
    return next();
  }
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    const access = { in: extractTableFromUrl(req.url),
      to: req.params.id,
      user_id: req.user.id,
    };
    const promises = [];
    promises.push(User.isAdmin(access.user_id));
    promises.push(Access.hasReadAccess(access.user_id, access.to, access.in));
    Promise.all(promises).then((results) => {
      if (results[0] || results[1]) {
        return next();
      }

      logout(req, res);
    }).catch(() => {
      logout(req, res);
    });
  } else {
    // if they aren't redirect them to the home page
    logout(req, res);
  }
}

function isAdmin(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    User.isAdmin(req.user.id).then((isAdmin) => {
      if (isAdmin) {
        return next();
      }

      logout(req, res);
    }).catch(() => {
      logout(req, res);
    });
  } else {
    logout(req, res);
  }
}

function logout(req, res) {
  // if they aren't redirect them to the home page

  req.logout();
  res.redirect('/');
}

function extractTableFromUrl(url) {
  const parts = url.split('/');
  if (parts[1] === 'api') {
    return parts[3];
  }
  return parts[1];
}
