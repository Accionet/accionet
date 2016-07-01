//server/controllers/placeController


var path = require('path');
var Places = require('../models/places.js');




exports.index = function(req, res) {
    Places.all(function(err, response) {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: "ERROR:" + err,
                places: []
            });
        }

        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
            places: response.results
        });

    });
};


exports.activePlaces = function(req, res) {

};

/*Shows the view to create a new place */
exports.new = function(req, res) {
    Places.new(function(err, result) {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: "ERROR:" + err,
                places: []
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'create.ejs'), {
            place: result
        });

    });

};


exports.create = function(req, res) {

    console.log(req.body);
    if (req.body.name && req.body.email) {
        Places.save(req.body, function(err, response) {
            if (err) {
                return res.status(400).send({
                    error: "ERROR:" + err
                });
            }
            return res.status(200).send({
                success: response.success,
                place: response.entry
            });
        });
    } else {
        //Responder con attributos mal hechos
    }
};

/*Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function(req, res) {

    Places.toggleIsActive(req.params.id, function(err, response) {
        if (err) {
            return res.status(400).send({
                error: err
            });
        }
        console.log('----------------------toggleIsActive');
        console.log(response);
        return res.status(200).send({
            success: response.success,
            place: response.entry

        });
    });
};


/* sets the is_active to true */
exports.activate = function(req, res) {

};

exports.edit = function(req, res) {
    Places.findById(req.params.id, function(err, response) {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: "ERROR:" + err,
                places: []
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
            place: response.results[0]
        });

    });

};

exports.show = function(req, res) {
    Places.findById(req.params.id, function(err, response) {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: "ERROR:" + err,
                places: []
            });
        }
        console.log(response);
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
            place: response.results[0]

        });

    });
};

exports.update = function(req, res) {
    console.log(req.params.id);
    console.log(req.body);
    Places.update(req.params.id, req.body, function(err, response) {
        if (err) {
            return res.status(400).send({
                error: err
            });
        }
        return res.status(200).send({
            success: response.success,
            place: response.entry
        });
    });

};
