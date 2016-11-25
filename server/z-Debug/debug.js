/* eslint-disable */
'use strict';
// process.env.NODE_ENV = 'test';

const Table = require('../newModels/table');
const Question = require('../newModels/questions');
const Option = require('../newModels/options');
const Place = require('../newModels/places');
const Answer = require('../models/answer');
const Response = require('../models/responses');

const VisitMetric = require('../newModels/metrics/VisitMetric');
const knex = require('../db/knex');
const utils = require('../services/utils');
const cmd = require('node-cmd');

const visit = require('../models/visits');

// console.log(knex.select('*').from('users').join('accounts', function() {
//   this.on('accounts.id', '=', 'users.account_id').andOn('accounts.owner_id', '=', 'users.id')
// }).toString());
Response.dataForExcel({survey_id: 2386});


// class Animal {
//
//   constructor(name){
//     this.name = name;
//   }
//
//   speak(){
//     console.log(`Im a ${this.name} and Im a animal`);
//   }
// }
//
// class Dog extends Animal {
//
//   speak(){
//     super.speak();
//     console.log(' and I bark');
//   }
// }
//
// // decorate
// console.log(Dog.prototype);
//
// Dog.prototype['run'] = function() {
//   console.log(`Im running! And i am ${this.name}`);
// }
//
// // log
//
// const animal = new Animal('Jhonny');
//
// animal.speak();
//
// const doggy = new Dog('Mr. Peanutbutter');
//
// doggy.speak();
//
// doggy.run();
