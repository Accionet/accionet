//server/controllers/placeController


var path = require('path');
var Places = require('../models/places.js');
var Survey = require('../models/surveys.js');
var Response = require('../models/response.js');




exports.index = function(req, res) {
    Places.all(function(err, places) {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'dashboard.ejs'), {
                error: "ERROR:" + err,
                places: []
            });
        }

        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'dashboard.ejs'), {
            places: places
        });

    });
};
