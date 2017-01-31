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

/* Shows the view to create a new user */
exports.new = function (req, res) {
  Users.new().then((result) => {
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'create.ejs'), {
      user: result,
      message: req.flash('signupMessage'),
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'create.ejs'), {
      error: `ERROR: ${err}`,
      user: [],
      message: req.flash('signupMessage'),

    });
  });
};

function getUser(id, req, res) {
  Users.findById(id).then((user) => {
    if (!user) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'show.ejs'), {
        error: 'ERROR: No user found',
        show_user: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'show.ejs'), {
      show_user: user,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'show.ejs'), {
      error: `ERROR: ${err}`,
      show_user: [],
    });
  });
}

exports.show = function (req, res) {
  return getUser(req.params.id, req, res);
};

exports.profile = function (req, res) {
  console.log('useer');
  console.log(req.user);
  console.log('passport');
  console.log(req);
  return getUser(req.user.id, req, res);
};
