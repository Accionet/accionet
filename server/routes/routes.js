var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

// var passport = require('passport');

var placeController = require('../controllers/placeController.js');
var userController = require('../controllers/userController.js');
var surveyController = require('../controllers/surveyController.js');



/* GET  page. */
router.get('/', function(req, res, next) {
    //userController.login(req,res);
    placeController.index(req, res, next);
    //res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
});

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
    placeController.index(req, res, next);
    //res.sendFile(path.join(__dirname, '../','../', 'client','views', 'index.html'));
});

// // process the login form
// router.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/dashboard', // redirect to the secure profile section
//     failureRedirect : '/', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//////////////////////////////////////////////
///////////// PLACES ////////////////////////
////////////////////////////////////////////


router.get('/places', function(req, res, next) {
    placeController.index(req, res, next);
});

router.get('/places/:id/edit', function(req, res, next) {
    placeController.edit(req, res, next);
});


router.get('/places/new', function(req, res, next) {
    placeController.new(req, res, next);
});

router.get('/places/:id', function(req, res, next) {
    placeController.show(req, res, next);
});

router.post('/places/new', function(req, res, next) {
    placeController.create(req, res, next);
});

router.put('/places/:id/edit', function(req, res, next) {
    placeController.update(req, res, next);
});

router.put('/places/:id/toggleIsActive', function(req, res, next) {
    placeController.toggleIsActive(req, res, next);
});

//////////////////////////////////////////////
///////////// SURVEY ////////////////////////
////////////////////////////////////////////


router.get('/survey', function(req, res, next) {
  res.render(path.join(__dirname, '../', '../', 'client', 'views', 'surveys', 'answer.ejs'), {
      error: "ERROR:",
      places: []
  });
});


router.post('/survey/:id/response', function(req, res, next) {
    surveyController.responseSurvey(req, res, next);
});



//---------------------------------------------------------------------------------//
//                               API                                              //
//-------------------------------------------------------------------------------//

//////////////////////////////////////////////
///////////// PLACES  ///////////////////////
////////////////////////////////////////////


router.post('/api/v1/places/create', function(req, res) {

    var results = [];

    console.log(req);

    // Grab data from http request
    var data = {
        name: req.body.name,
        is_active: false
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO places(name, is_active) values($1, $2)", [data.name, data.is_active]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM places ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

router.get('/api/v1/places', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM places ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});


router.put('/api/v1/places/:place_id/edit', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.places_id;

    // Grab data from http request
    var data = {
        text: req.body.text,
        complete: req.body.complete
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).send(json({
                success: false,
                data: err
            }));
        }

        // SQL Query > Update Data
        client.query("UPDATE places SET name=($1), is_active=($2) WHERE id=($3)", [data.name, data.is_active, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM places ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

router.delete('/api/v1/places/:place_id/delete', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.place_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM places WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM places ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

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
