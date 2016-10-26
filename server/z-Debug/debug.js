'use strict';

const Table = require('../newModels/table');


const surveys = new Table('surveys');


surveys.getAttributesNames().then((count) => {
  console.log(count);
}).catch((err) => {
  console.log(err);
});
