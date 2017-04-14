/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');
const Place = require('../newModels/places');
const Answer = require('../models/answer');
const User = require('../models/users');

const Survey = require('../models/surveys');

const AnswerMetric = require('../models/metrics/answerMetric');
const knex = require('../db/knex');
const utils = require('../services/utils');
const cmd = require('node-cmd');

const visit = require('../models/visits');

const userController = require('../controllers/userController');


function getUser(i) {
  return {
    username: `usernameForAccess${i}`,
    password: 'password',
    email_verified: 'true',
    email: 'a@a.cl',
  };
}

function getPlace() {
  return {
    name: 'name',
  };
}

let places = [];


function setAccessTo(place, accessType) {
  return { in: 'places',
    to: place.id,
    accessType,
  };
}

function accessIsIn(access, array) {
  for (let i = 0; i < array.length; i++) {
    if (access.in === array[i].in && access.to === array[i].to && access.accessType === array[i].accessType) {
      return true;
    }
  }
  return false;
}
const promises = [];
for (let i = 0; i < 4; i++) {
  promises.push(Place.save(getPlace()));
}
Promise.all(promises).then((results) => {
  places = results;
  const newUser = getUser(10);
  const initialAccess = [];
  initialAccess.push(setAccessTo(places[0], 'r'));
  newUser.access = initialAccess;
  return User.save(newUser).then((user) => {
    initialAccess.push(setAccessTo(places[1], 'r'));
    User.editAccess(user, initialAccess).then((finalAccess) => {
      done();
    }).catch((err) => {
      done(err);
    });
  }).catch((err) => {
    done(err);
  });
  done();
}).catch((err) => {
  done(err);
});
