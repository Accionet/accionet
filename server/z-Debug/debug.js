'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const options = require('../newModels/options');

const utils = require('../services/utils');


options.all().then((a) => {
  console.log(a);
});
