/* eslint-disable */
'use strict';
process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');

const utils = require('../services/utils');


// Question.all().then((questions) => {
//   const question = {
//     id: questions[0].id,
//     options: [],
//   };
//   Option.updateOptionsOfQuestion(question).then(() => {
//     console.log('llego');
//   }).catch((err) => {
//     console.log(err);
//   }).catch((err) => {
//     console.log(err);
//   });
// }).catch((err) => {
//   console.log(err);
// });

let json = {
  some: 'th',
  ohter: 'e'
};

const va = 'some';

console.log(json[va]);

delete json[va];

console.log(json);
