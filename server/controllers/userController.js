
const path = require('path');


exports.login = function renderLogin(req, res) {
  res.render(path.join(__dirname, '../', '../', 'client', 'views', 'login.ejs'));
};

// exports.logout = function (req, res) {
//
// };
//
// exports.new = function (req, res) {
//
// };
//
// exports.create = function (req, res) {
//
// };
//
// exports.profile = function (req, res) {
//
// };
