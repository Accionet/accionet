// server/controllers/placeController


const path = require('path');
const Places = require('../models/places');


exports.index = function getAllPlaces(req, res) {
    Places.all((err, result) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: `ERROR: ${err}`,
                places: [],
            });
        }
        console.log(result);
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
            places: result,
        });
    });
};


exports.activePlaces = function getActivePlaces(req, res) {

};

/* Shows the view to create a new place */
exports.new = function getNewPlace(req, res) {
    Places.new((err, result) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: `ERROR: ${err}`,
                places: [],
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'create.ejs'), {
            place: result,
        });
    });
};


exports.create = function savePlace(req, res) {
    if (req.body.name && req.body.email) {
        Places.save(req.body, (err, message) => {
            if (err) {
                return res.status(400).send({
                    error: err,
                });
            }
            return res.status(200).send({
                success: message,
            });
        });
    } else {
        // Responder con attributos mal hechos
    }
};

/* Equivalent to delete but sets the is_active to false*/
exports.toggleIsActive = function toggleIsActive(req, res) {
    Places.toggleIsActive(req.params.id, (err, response) => {
        if (err) {
            return res.status(400).send({
                error: err,
            });
        }

        const json = { place: response };
        return res.status(200).send(json);
    });
};


/* sets the is_active to true */
exports.activate = function setIsActiveToTure(req, res) {

};

exports.edit = function editPlace(req, res) {
    Places.findById(req.params.id, (err, place) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: `ERROR: ${err}`,
                places: [],
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'edit.ejs'), {
            place,
        });
    });
};

exports.show = function showPlace(req, res) {
    Places.findById(req.params.id, (err, place) => {
        if (err) {
            res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'index.ejs'), {
                error: `ERROR: ${err}`,
                place: [],
            });
        }
        res.render(path.join(__dirname, '../', '../', 'client', 'views', 'places', 'show.ejs'), {
            place,
        });
    });
};

exports.update = function updatePlace(req, res) {
    Places.update(req.params.id, req.body, (err, response) => {
        if (err) {
            return res.status(400).send({
                error: err,
            });
        }
        return res.status(200).send({
            success: response.message,
            place: response.place,
        });
    });
};
