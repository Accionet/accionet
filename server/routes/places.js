'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

// var passport = require('passport');

const placeController = require('../controllers/placeController');
const visitController = require('../controllers/visitController');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


router.get('/:id/excel', (req, res, next) => {
  visitController.generateExcel(req, res, next);
});


module.exports = router;
