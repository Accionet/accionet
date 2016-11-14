/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');

const utils = require('../services/utils');
const cmd = require('node-cmd');


// cmd.get(
//       'mocha test/unit-testing/models/options/upsert.js --timeout 20000 --recursive',
//       function(data){
//           console.log(data);
//       }
//   );
