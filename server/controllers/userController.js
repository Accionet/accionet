//
// const path = require('path');
// const Users = require('../models/users');
// const httpResponse = require('../services/httpResponse');
//
// exports.login = function renderLogin(req, res) {
//   res.render(path.join(__dirname, '../', '../', 'client', 'views', 'login.ejs'));
// };
//
//
// exports.count = function countUsers(req, res) {
//   Users.count({}, (err, result) => {
//     if (err) {
//       const json = httpResponse.error(err);
//       return res.status(500).send(json);
//     }
//     const success_json = httpResponse.success('Usuarios contados exitosamente', 'amount', result);
//     return res.status(200).send(success_json);
//   });
// };
//
// // exports.logout = function (req, res) {
// //
// // };
// //
// // exports.new = function (req, res) {
// //
// // };
// //
// // exports.create = function (req, res) {
// //
// // };
// //
// // exports.profile = function (req, res) {
// //
// // };
