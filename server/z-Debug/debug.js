'use strict';

const Table = require('../newModels/table');
const options = require('../newModels/options');


// const surveys = new Activatable('surveys');


options.all().then((count) => {
  console.log(count);
}).catch((err) => {
  console.log(err);
});
