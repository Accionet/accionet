var pg = require('pg');
var path = require('path');

var User = require('../models/users.js');
var Place = require('../models/places.js');
var Surveys = require('../models/surveys.js');


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
            newSurvey.title = "Rango Etario Streetpark";
            newSurvey.is_active = true;
            newSurvey.questions = [];

            newSurvey.questions.push({
                title: "¿En qué rango etario te encuentras? Si ya has respondido esta pregunta selecciona la opción h: ya he respondido esta pregunta",
                type: "multiple_choice",
                number: 1,
                options: [{
                    statement: "10 años o menor",
                    enumeration: "a"
                }, {
                    statement: "Entre 10 y 15 años",
                    enumeration: "b"
                }, {
                    statement: "entre 16 y 20 años",
                    enumeration: "c"
                }, {
                    statement: "entre 21 y 25 años",
                    enumeration: "d"
                }, {
                    statement: "entre 26 y 30 años",
                    enumeration: "e"
                }, {
                    statement: "entre 31 y 40 años",
                    enumeration: "f"
                }, {
                    statement: "más de 40 años",
                    enumeration: "g"
                }, {
                    statement: "Ya he respondido esta pregunta",
                    enumeration: "h"
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

    newPlace.name = 'Streetpark Las Condes';
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

Place.new(function(err, newPlace) {
    if (err) {
        console.log("ERROR: " + err);
        return err;
    }

    newPlace.name = 'Barrio Franklin';
    newPlace.description = '';
    newPlace.daily_visits = 4500;
    newPlace.is_active = false;
    Place.save(newPlace, function(err, savedPlace) {
        if (err) {
            console.log("ERROR: " + err);
            return err;
        }
        console.log(newPlace.name + " saved");
    });
});
