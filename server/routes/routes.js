'use strict';

// const express = require('express');
const path = require('path');
// eslint-disable-next-line new-cap

// var passport = require('passport');

const placeController = require('../controllers/placeController');
const responseController = require('../controllers/responseController');
const userController = require('../controllers/userController');
const surveyController = require('../controllers/surveyController');
const dashboardController = require('../controllers/dashboardController');
const visitController = require('../controllers/visitController');

module.exports = function router(app, passport) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
  res.redirect('/');
}

function hasAccessToWrite(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function hasAccessToRead(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function isAdmin(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}
