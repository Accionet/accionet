// server/controllers/placeController


const path = require('path');
const Places = require('../models/places');


exports.index = function getAllPlaces(req, res) {
  Places.all((err, places) => {
    if (err) {
      res.render(path.join(__dirname, '../', '../', 'client', 'views', 'dashboard.ejs'), {
        error: `ERROR: ${err}`,
        places: [],
      });
    }

    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'dashboard.ejs'), {
      places,
    });
  });
};
