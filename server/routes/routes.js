 const express = require('express');
 const path = require('path');

 const router = express.Router();

 // var passport = require('passport');

 const placeController = require('../controllers/placeController');
 // const userController = require('../controllers/userController');
 const surveyController = require('../controllers/surveyController');
 const dashboardController = require('../controllers/dashboardController');


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

 router.get('/login', (req, res, next) => {
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


 router.get('/places/all', (req, res, next) => {
     placeController.index(req, res, next);
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

 // ////////////////////////////////////////////
 // /////////// SURVEY ////////////////////////
 // //////////////////////////////////////////


 router.get('/surveys/all', (req, res, next) => {
     surveyController.index(req, res, next);
 });

 router.get('/surveys/:id', (req, res, next) => {
     surveyController.show(req, res, next);
 });

 router.get('/surveys/:id/metrics', (req, res, next) => {
     surveyController.metrics(req, res, next);
 });


 router.post('/survey/:id/response', (req, res, next) => {
     surveyController.responseSurvey(req, res, next);
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
