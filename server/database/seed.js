var pg = require('pg');
var path = require('path');

var User = require('../models/users.js');
var Place = require('../models/places.js');
var Surveys = require('../models/surveys.js');


// var connectionString = require(path.join(__dirname, '../', '../', 'config'));
//
// var client = new pg.Client(connectionString);
// console.log(connectionString);
// client.connect();
//Insert existing places


// //Insert streetpark
// streetpark = [];
// /*name*/
// streetpark.push('Streetpark Las Condes');
// /*description*/
// streetpark.push('El streetpark Las Condes es un parque público para hacer patinaje, skateboard, entre otros. Este parque reproduce los lugares más típicos de una ciudad que sean atractivos para los skaters. Este se encuentra ubicado en el parque araucano, colindando con Av. Manquehue Norte. Su cercanía con el Parque Arauco puede ser atractivos para marcas presentes en este mall ya que les puede servir para dirigir gente hacia sus tiendas.');
// /*is_active*/
// streetpark.push(false);
// /*daily_visits*/
// streetpark.push(500);
// /*created at*/
// streetpark.push(new Date());
// /*update at*/
// streetpark.push(new Date());
// /*email*/
// streetpark.push('no hay mail de registro');
// /*email_verified*/
// streetpark.push(false);
// /*status*/
// streetpark.push(0);
// /*password*/
// streetpark.push('password');
//
// var query = client.query("INSERT INTO places(name, description, is_active, daily_visits, created_at, updated_at, email, email_verified, status, password) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", streetpark);
// //console.log(query);
// query.on('end', function() {
//     client.end();
// });

//Admin
User.new(function(err, newUser) {
    if (err) {
        console.log("ERROR: " + err);
        return err;
    }

    newUser.username = "accionet";
    newUser.password = "accionet159";
    newUser.email = "antonio@accionet.cl";
    newUser.is_admin = true;
    newUser.is_active = true;

    User.save(newUser, function(err, savedUser) {
        if (err) {
            console.log("ERROR: " + err);
            return err;
        }
        console.log(newUser.username + " saved");

        Surveys.new(function(err, newSurvey) {
            if (err) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = savedUser.id;
            newSurvey.title = "meneh";
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: "titulo",
                type: "short_answer",
                number: 1
            });

            newSurvey.questions.push({
                title: "titulo 2",
                type: "multiple_choice",
                number: 2,
                options: [{
                    statement: "opcion a",
                    enumeration: "a"
                }, {
                    statement: "opcion b",
                    enumeration: "b"
                }, {
                    statement: "opcion c",
                    enumeration: "c"
                }]
            });


            Surveys.save(newSurvey, function(err, savedSurvey) {
                if (err) {
                    console.log(err);
                    return err;
                }
                console.log("survey" + savedSurvey.title + " " + 'saved');

            });
        });
        Surveys.new(function(err, newSurvey) {
            if (err) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = 1;
            newSurvey.title = "meneh survey";
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: "titulo",
                type: "short_answer",
                number: 1
            });

            newSurvey.questions.push({
                title: "titulo 2",
                type: "multiple_choice",
                number: 2,
                options: [{
                    statement: "opcion a",
                    enumeration: "a"
                }, {
                    statement: "opcion b",
                    enumeration: "b"
                }, {
                    statement: "opcion c",
                    enumeration: "c"
                }]
            });


            Surveys.save(newSurvey, function(err, savedSurvey) {
                if (err) {
                    console.log(err);
                    return err;
                }
                console.log("survey" + savedSurvey.title + " " + 'saved');

            });
        });

        Surveys.new(function(err, newSurvey) {
            if (err) {
                console.log(err);
                return err;
            }
            newSurvey.user_id = 1;
            newSurvey.title = "masdfdsfh";
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: "titulo",
                type: "short_answer",
                number: 1
            });

            newSurvey.questions.push({
                title: "titulo 2",
                type: "multiple_choice",
                number: 2,
                options: [{
                    statement: "opcion a",
                    enumeration: "a"
                }, {
                    statement: "opcion b",
                    enumeration: "b"
                }, {
                    statement: "opcion c",
                    enumeration: "c"
                }]
            });


            Surveys.save(newSurvey, function(err, savedSurvey) {
                if (err) {
                    console.log(err);
                    return err;
                }
                console.log("survey" + savedSurvey.title + " " + 'saved');

            });
        });
    });
});


Place.new(function(err, newPlace) {
    if (err) {
        console.log("ERROR: " + err);
        return err;
    }

    newPlace.name = 'streetpark Las Condes';
    newPlace.description = 'El streetpark Las Condes es un parque público para hacer patinaje, skateboard, entre otros. Este parque reproduce los lugares más típicos de una ciudad que sean atractivos para los skaters. Este se encuentra ubicado en el parque araucano, colindando con Av. Manquehue Norte. Su cercanía con el Parque Arauco puede ser atractivos para marcas presentes en este mall ya que les puede servir para dirigir gente hacia sus tiendas.';
    newPlace.daily_visits = 500;
    newPlace.is_active = true;
    Place.save(newPlace, function(err, savedPlace) {
        if (err) {
            console.log("ERROR: " + err);
            return err;
        }
        console.log(newPlace.name + " saved");
    });
});
