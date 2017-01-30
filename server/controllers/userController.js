//
const path = require('path');
const Users = require('../models/users');
// const httpResponse = require('../services/httpResponse');


exports.count = function getAmountOf(req, res) {
  Users.count({}).then((count) => {
    const response = {
      success: 'Amount of users where counted successfully',
      amount: count,
    };
    return res.status(200).send(response);
  }).catch((err) => {
    return res.status(500).send({
      error: err,
      amount: '?',
    });
  });
};


function all(req, res, active) {
  Users.find({
    is_active: active,
  }).then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'index.ejs'), {
      users: result,
      show_active: active,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'index.ejs'), {
      error: `ERROR: ${err}`,
      users: [],
      show_active: active,
    });
  });
}

exports.index = function (req, res) {
  return all(req, res, true);
};

exports.disabled = function (req, res) {
  return all(req, res, false);
};
