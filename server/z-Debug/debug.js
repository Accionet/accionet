'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const options = require('../newModels/options');

const utils = require('../services/utils');

console.log(options.table_name);
console.log(options.table());
