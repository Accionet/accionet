// server/controllers/placeController


const path = require('path');
const Places = require('../models/places');


exports.show = function showDashboard(req, res) {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'dashboard.ejs'), {});
};
