//
const path = require('path');
const Users = require('../models/users');
const httpResponse = require('../services/httpResponse');


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
  return getUser(req.user.id, req, res);
};

exports.edit = function (req, res) {
  Users.findById(req.params.id).then((user) => {
    if (!user) {
      return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'edit.ejs'), {
        error: 'ERROR: No user found',
        show_user: [],
      });
    }
    res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'edit.ejs'), {
      show_user: user,
    });
  }).catch((err) => {
    return res.render(path.join(__dirname, '../', '../', 'client', 'views', 'users', 'edit.ejs'), {
      error: `ERROR: ${err}`,
      show_user: [],
    });
  });
};

exports.update = function updateUser(req, res) {
  const id = parseInt(req.params.id, 10);
  Users.update(id, req.body).then((user) => {
    if (!user) {
      return res.status(400).send({
        error: 'No user found',
      });
    }
    const json = httpResponse.success(`Cambios a  + ${user.name} agregados exitosamente.`, 'user', user);
    return res.status(200).send(json);
  }).catch((err) => {
    return res.status(400).send({
      error: err,
    });
  });
};

exports.toggleIsActive = function toggleIsActive(req, res) {
  Users.toggleIsActive(req.params.id).then((response) => {
    const json = {
      user: response,
    };
    return res.status(200).send(json);
  }).catch((err) => {
    return res.status(400).send({
      error: err,
    });
  });
};

exports.isUnique = function (req, res) {
  const username = req.params.username;
  Users.usernameTaken(username).then((taken) => {
    return res.status(200).send(!taken);
  }).catch((err) => {
    return res.status(500).send({
      error: err,
    });
  });
};
