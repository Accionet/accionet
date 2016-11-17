/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');
const Place = require('../newModels/places');

const VisitMetric = require('../newModels/metrics/VisitMetric');

const utils = require('../services/utils');
const cmd = require('node-cmd');

Place.findById(2062).then((place) => {
  console.log(place);
  const metrics = new VisitMetric(place);

  metrics.amountByDay();
}).catch((err) =>{
  console.log(err);
});

// cmd.get(
//       'mocha test/unit-testing/models/options/upsert.js --timeout 20000 --recursive',
//       function(data){
//           console.log(data);
//       }
//   );
