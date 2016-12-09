'use strict';

const express = require('express');
const path = require('path');
// eslint-disable-next-line new-cap
const router = express.Router();

// var passport = require('passport');

const placeController = require('../controllers/placeController');
const userController = require('../controllers/userController');
const surveyController = require('../controllers/surveyController');
const dashboardController = require('../controllers/dashboardController');
const visitController = require('../controllers/visitController');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* GET  page. */
router.get('/', (req, res, next) => {
  // userController.login(req,res);
  dashboardController.show(req, res, next);
  // res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
});

router.get('/login', (req, res) => {
  // userController.login(req,res);
  res.render(path.join(__dirname, '../', '../', 'client', 'views', 'login.ejs'), {});
  // res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
});


/* GET home page. */
router.get('/dashboard', (req, res, next) => {
  dashboardController.show(req, res, next);
  // res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
});

// // process the login form
// router.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/dashboard', // redirect to the secure profile section
//     failureRedirect : '/', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));

// router.get('/logout', function (req, res) {
//     req.logout();
//     res.redirect('/');
// });

// ////////////////////////////////////////////
// /////////// PLACES ////////////////////////
// //////////////////////////////////////////


router.get('/places', (req, res, next) => {
  placeController.index(req, res, next);
});

router.get('/places/disabled', (req, res, next) => {
  placeController.disabled(req, res, next);
});

router.get('/places/count', (req, res, next) => {
  placeController.count(req, res, next);
});

router.get('/places/:id/edit', (req, res, next) => {
  placeController.edit(req, res, next);
});


router.get('/places/new', (req, res, next) => {
  placeController.new(req, res, next);
});

router.get('/places/:id', (req, res, next) => {
  placeController.show(req, res, next);
});

router.post('/places/new', (req, res, next) => {
  placeController.create(req, res, next);
});

router.put('/places/:id/edit', (req, res, next) => {
  placeController.update(req, res, next);
});

router.put('/places/:id/toggleIsActive', (req, res, next) => {
  placeController.toggleIsActive(req, res, next);
});

router.get('/places/:id/metrics', (req, res, next) => {
  placeController.metrics(req, res, next);
});


// ////////////////////////////////////////////
// /////////// SURVEY ////////////////////////
// //////////////////////////////////////////


router.get('/surveys', (req, res, next) => {
  surveyController.index(req, res, next);
});

router.get('/surveys/disabled', (req, res, next) => {
  surveyController.disabled(req, res, next);
});


router.get('/surveys/new', (req, res, next) => {
  surveyController.new(req, res, next);
});

router.post('/surveys/new', (req, res, next) => {
  surveyController.create(req, res, next);
});

router.get('/surveys/count', (req, res, next) => {
  surveyController.count(req, res, next);
});

router.get('/surveys/:id', (req, res, next) => {
  surveyController.show(req, res, next);
});

router.get('/surveys/:id/edit', (req, res, next) => {
  surveyController.edit(req, res, next);
});

router.get('/surveys/:id/metrics', (req, res, next) => {
  surveyController.metrics(req, res, next);
});

router.get('/surveys/:id/excel', (req, res, next) => {
  surveyController.generateExcel(req, res, next);
});

router.post('/survey/:id/response', (req, res, next) => {
  surveyController.responseSurvey(req, res, next);
});

router.put('/surveys/:id/toggleIsActive', (req, res, next) => {
  surveyController.toggleIsActive(req, res, next);
});

router.put('/surveys/:id/update', (req, res, next) => {
  surveyController.update(req, res, next);
});

router.delete('/surveys/:id/delete', (req, res, next) => {
  surveyController.delete(req, res, next);
});


// API

router.get('/api/v1/surveys/:id/metrics/responses/byhour', (req, res, next) => {
  surveyController.metricsByHour(req, res, next);
});

router.get('/api/v1/surveys/:id/metrics/responses/byday', (req, res, next) => {
  surveyController.metricsByDay(req, res, next);
});

router.get('/api/v1/surveys/:id/metrics/responses/count', (req, res, next) => {
  surveyController.countResponses(req, res, next);
});

router.get('/api/v1/surveys/:id/metrics/enduser/count', (req, res, next) => {
  surveyController.countEndUser(req, res, next);
});


// //////////////////////////////////////////
// ///////// Visits  ////////////////////
// ////////////////////////////////////////

router.post('/visits/new', (req, res, next) => {
  visitController.create(req, res, next);
});

router.get('/visits/count', (req, res, next) => {
  visitController.count(req, res, next);
});

router.get('/api/v1/places/:id/metrics/visits/daily', (req, res, next) => {
  visitController.dailyTable(req, res, next);
});

router.get('/api/v1/places/:id/metrics/visits/hourly', (req, res, next) => {
  visitController.hourlyTable(req, res, next);
});

router.get('/api/v1/places/:id/metrics/visits/dayandhour', (req, res, next) => {
  visitController.dayAndHourTable(req, res, next);
});

router.get('/api/v1/places/:id/metrics/visits/count', (req, res, next) => {
  visitController.countOfPlace(req, res, next);
});

router.get('/api/v1/surveys/:id/metrics/visits/count', (req, res, next) => {
  visitController.countOfSurvey(req, res, next);
});

router.get('/api/v1/places/:id/metrics/endusers/count', (req, res, next) => {
  visitController.countEndUsersOfPlace(req, res, next);
});


// //////////////////////////////////////////
// ///////// USERS  ////////////////////////
// ////////////////////////////////////////

router.get('/users/count', (req, res, next) => {
  userController.count(req, res, next);
});
//
// ////////////////////////////////////////////
// /////////// CHECK LOGIN  //////////////////
// //////////////////////////////////////////
//
//
// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {
//
//     // if user is authenticated in the session, carry on
//     if (req.isAuthenticated())
//         return next();
//
//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }

module.exports = router;
