
var path = require('path');
var Places = require('../models/places.js');


exports.login = function(req, res) {
  res.render(path.join(__dirname, '../', '../', 'client', 'views', 'login.ejs'));
};

exports.logout = function(req, res) {

};

exports.new = function(req, res) {

};

exports.create = function(req, res) {

};

exports.profile = function(req, res) {

};
